import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/Team";
import User from "@/models/User";

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
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get teams where user is founder or member
    const teams = await Team.find({
      $or: [
        { founderId: user._id.toString() },
        { "members.userId": user._id.toString() }
      ]
    }).populate('founderId', 'name email avatar');

    return NextResponse.json({
      success: true,
      teams: teams.map(team => ({
        id: team._id.toString(),
        name: team.name,
        description: team.description,
        founderId: team.founderId,
        members: team.members,
        openRoles: team.openRoles,
        stage: team.stage,
        industry: team.industry,
        isPublic: team.isPublic,
        createdAt: team.createdAt
      }))
    });
  } catch (error) {
    console.error("Teams API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { name, description, stage, industry, openRoles } = await request.json();

    // Validate required fields
    if (!name || !description || !stage || !industry) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Create new team
    const newTeam = new Team({
      name,
      description,
      founderId: user._id.toString(),
      members: [{
        userId: user._id.toString(),
        role: 'founder',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date()
      }],
      openRoles: openRoles || [],
      stage,
      industry,
      isPublic: true,
      createdAt: new Date()
    });

    await newTeam.save();

    return NextResponse.json({
      success: true,
      team: {
        id: newTeam._id.toString(),
        name: newTeam.name,
        description: newTeam.description,
        founderId: newTeam.founderId,
        members: newTeam.members,
        openRoles: newTeam.openRoles,
        stage: newTeam.stage,
        industry: newTeam.industry,
        isPublic: newTeam.isPublic,
        createdAt: newTeam.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 