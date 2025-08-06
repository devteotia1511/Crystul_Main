import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/Team";
import User from "@/models/User";
import Message from "@/models/Message";
import Task from "@/models/Task";

export const dynamic = 'force-dynamic';

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

    // Get user's teams
    const userTeams = await Team.find({
      $or: [
        { founderId: user._id.toString() },
        { "members.userId": user._id.toString() }
      ]
    });

    // Get team IDs for messages and tasks
    const teamIds = userTeams.map(team => team._id.toString());

    // Get messages count
    const messagesCount = await Message.countDocuments({
      teamId: { $in: teamIds }
    });

    // Get unread messages count (assuming messages have a read status)
    const unreadMessagesCount = await Message.countDocuments({
      teamId: { $in: teamIds },
      readBy: { $ne: user._id.toString() }
    });

    // Get tasks count
    const tasksCount = await Task.countDocuments({
      teamId: { $in: teamIds }
    });

    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      teamId: { $in: teamIds },
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get potential matches count
    const allUsers = await User.find({ 
      _id: { $ne: user._id },
      isPublic: true 
    });

    const matchesCount = allUsers.length;

    return NextResponse.json({
      success: true,
      stats: {
        teamsCount: userTeams.length,
        matchesCount,
        messagesCount,
        unreadMessagesCount,
        tasksCount,
        tasksDueToday
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 