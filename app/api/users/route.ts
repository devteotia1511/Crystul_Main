import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Team from "@/models/Team";

export async function GET(request: NextRequest) {
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
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // Get all public users except current user
    const users = await User.find({
      _id: { $ne: currentUser._id },
      isPublic: true
    });
    // For each user, find their team name (first team where they are a member or founder)
    const usersWithTeam = await Promise.all(users.map(async (user) => {
      const team = await Team.findOne({
        $or: [
          { founderId: user._id.toString() },
          { "members.userId": user._id.toString() }
        ]
      });
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        skills: user.skills,
        interests: user.interests,
        experience: user.experience,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt,
        teamName: team ? team.name : null
      };
    }));
    return NextResponse.json({
      success: true,
      users: usersWithTeam
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const dbConnection = await dbConnect();
    if (!dbConnection) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const body = await request.json();
    const allowed = ['name', 'avatar', 'bio', 'skills', 'interests', 'location', 'experience'];
    allowed.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        (currentUser as any)[k] = body[k];
      }
    });
    await currentUser.save();
    return NextResponse.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const dbConnection = await dbConnect();
    if (!dbConnection) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    await User.deleteOne({ _id: currentUser._id });
    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}