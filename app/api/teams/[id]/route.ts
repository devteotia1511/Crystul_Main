import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/Team";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbConnection = await dbConnect();
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 500 }
      );
    }

    const teamId = params.id;

    // Get team data
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Get founder data
    const founder = await User.findById(team.founderId);
    if (!founder) {
      return NextResponse.json(
        { success: false, message: "Founder not found" },
        { status: 404 }
      );
    }

    // Get team members data
    const memberIds = team.members.map((member: { userId: string }) => member.userId);
    const members = await User.find({ _id: { $in: memberIds } });

    // Combine team member data
    const teamMembersWithData = team.members.map((member: { userId: string }) => {
      const memberData = members.find(m => m._id.toString() === member.userId);
      return {
        ...member,
        name: memberData?.name || 'Unknown User',
        email: memberData?.email || '',
        avatar: memberData?.avatar,
        skills: memberData?.skills || []
      };
    });

    return NextResponse.json({
      success: true,
      team: {
        id: team._id.toString(),
        name: team.name,
        description: team.description,
        founderId: team.founderId,
        members: teamMembersWithData,
        openRoles: team.openRoles,
        stage: team.stage,
        industry: team.industry,
        isPublic: team.isPublic,
        createdAt: team.createdAt
      },
      founder: {
        id: founder._id.toString(),
        name: founder.name,
        email: founder.email,
        avatar: founder.avatar,
        skills: founder.skills
      }
    });
  } catch (error) {
    console.error("Team detail API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const dbConnection = await dbConnect();
    if (!dbConnection) {
      return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 });
    }

    const { action, targetUserId, update } = await request.json();
    const teamId = params.id;

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    if (action === 'update') {
      if (team.founderId !== currentUser._id.toString()) {
        return NextResponse.json({ success: false, message: 'Only founder can update team' }, { status: 403 });
      }
      const allowed = ['name', 'description', 'stage', 'industry', 'openRoles', 'isPublic'];
      allowed.forEach((key) => {
        if (update && Object.prototype.hasOwnProperty.call(update, key)) {
          (team as any)[key] = update[key];
        }
      });
      await team.save();
      return NextResponse.json({ success: true, message: 'Team updated' });
    }

    if (action === 'approve_join') {
      // Only founder can approve
      if (team.founderId !== currentUser._id.toString()) {
        return NextResponse.json({ success: false, message: 'Only founder can approve requests' }, { status: 403 });
      }
      if (!targetUserId) {
        return NextResponse.json({ success: false, message: 'targetUserId is required' }, { status: 400 });
      }
      // Add target user to team members if not already
      const alreadyMember = team.members?.some((m: any) => m.userId === targetUserId);
      if (!alreadyMember) {
        team.members.push({ userId: targetUserId, role: 'member', permissions: ['read'], joinedAt: new Date() });
        await team.save();
      }
      // Notify the user
      const accepted = new Notification({
        recipientId: targetUserId,
        senderId: currentUser._id.toString(),
        type: 'team_join_accepted',
        title: 'Team Join Approved',
        message: `Your request to join ${team.name} has been approved`,
        data: { teamId: team._id.toString(), teamName: team.name }
      });
      await accepted.save();
      return NextResponse.json({ success: true, message: 'User added to team' });
    }

    if (action === 'decline_join') {
      if (team.founderId !== currentUser._id.toString()) {
        return NextResponse.json({ success: false, message: 'Only founder can decline requests' }, { status: 403 });
      }
      if (!targetUserId) {
        return NextResponse.json({ success: false, message: 'targetUserId is required' }, { status: 400 });
      }
      const declined = new Notification({
        recipientId: targetUserId,
        senderId: currentUser._id.toString(),
        type: 'team_join_declined',
        title: 'Team Join Declined',
        message: `Your request to join ${team.name} was declined`,
        data: { teamId: team._id.toString(), teamName: team.name }
      });
      await declined.save();
      return NextResponse.json({ success: true, message: 'Join request declined' });
    }

    if (action === 'request_join') {
      // Notify the founder about join request
      const joinRequest = new Notification({
        recipientId: team.founderId,
        senderId: currentUser._id.toString(),
        type: 'team_join_request',
        title: 'Team Join Request',
        message: `${currentUser.name} wants to join ${team.name}`,
        data: { teamId: team._id.toString(), teamName: team.name }
      });
      await joinRequest.save();
      return NextResponse.json({ success: true, message: 'Join request sent' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Team PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const dbConnection = await dbConnect();
    if (!dbConnection) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json({ success: false, message: 'Team not found' }, { status: 404 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || team.founderId !== currentUser._id.toString()) {
      return NextResponse.json({ success: false, message: 'Only founder can delete team' }, { status: 403 });
    }

    await Team.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 