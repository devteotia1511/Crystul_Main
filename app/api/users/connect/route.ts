import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { sendEmail, verifyEmailTransport } from '@/lib/email';
import Chat from "@/models/Chat";

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

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "Target user ID is required" },
        { status: 400 }
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

    // Get target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Target user not found" },
        { status: 404 }
      );
    }

    // Check if already connected
    if (currentUser.connections && currentUser.connections.includes(targetUserId)) {
      return NextResponse.json(
        { success: false, message: "Already connected with this user" },
        { status: 400 }
      );
    }

    // Check if notification already exists
    const existingNotification = await Notification.findOne({
      senderId: currentUser._id.toString(),
      recipientId: targetUserId,
      type: 'connection_request',
      isAccepted: false
    });

    if (existingNotification) {
      return NextResponse.json(
        { success: false, message: "Connection request already sent" },
        { status: 400 }
      );
    }

    // Create notification for the target user
    const notification = new Notification({
      recipientId: targetUserId,
      senderId: currentUser._id.toString(),
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${currentUser.name} wants to connect with you`,
      data: {
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        senderAvatar: currentUser.avatar
      }
    });

    await notification.save();

    // Ensure a direct chat exists between the two users
    try {
      const participants = [currentUser._id.toString(), targetUser._id.toString()];
      let chat = await Chat.findOne({
        chatType: 'direct',
        participants: { $all: participants }
      });
      if (!chat) {
        chat = new Chat({
          participants,
          chatType: 'direct',
          teamId: null,
          messages: [],
          lastMessage: new Date(),
          isActive: true,
        });
        await chat.save();
      }
    } catch (e) {
      console.error('Failed to ensure direct chat exists:', e);
    }

    // Send email notification to the target user
    try {
      // Verify SMTP transport (logs success/failure)
      await verifyEmailTransport();

      await sendEmail({
        to: targetUser.email,
        subject: `New Connection Request from ${currentUser.name}`,
        text: `Hello ${targetUser.name},\n\n${currentUser.name} (${currentUser.email}) wants to connect with you on Crystul. Log in to your dashboard to accept or view the request.`,
        html: `<p>Hello ${targetUser.name},</p>
               <p><strong>${currentUser.name}</strong> (${currentUser.email}) wants to connect with you on Crystul.</p>
               <p>Log in to your dashboard to accept or view the request.</p>
               <p style="color: #888; font-size: 12px;">This is an automated notification from Crystul.</p>`,
        replyTo: currentUser.email,
        fromName: currentUser.name,
      });
    } catch (err) {
      console.error('Failed to send connection request email:', err);
    }

    return NextResponse.json({
      success: true,
      message: "Connection request sent successfully"
    });
  } catch (error) {
    console.error("Connect API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 