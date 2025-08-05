import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/Team";
import User from "@/models/User";

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
    const memberIds = team.members.map(member => member.userId);
    const members = await User.find({ _id: { $in: memberIds } });

    // Combine team member data
    const teamMembersWithData = team.members.map(member => {
      const memberData = members.find(m => m._id.toString() === member.userId);
      return {
        ...member.toObject(),
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