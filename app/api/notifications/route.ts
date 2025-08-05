import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
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
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get notifications for the current user
    const notifications = await Notification.find({
      recipientId: currentUser._id.toString()
    }).sort({ createdAt: -1 }).limit(50);

    // Get sender information for each notification
    const notificationsWithSenders = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await User.findById(notification.senderId);
        return {
          id: notification._id.toString(),
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          isRead: notification.isRead,
          isAccepted: notification.isAccepted,
          createdAt: notification.createdAt,
          sender: sender ? {
            id: sender._id.toString(),
            name: sender.name,
            email: sender.email,
            avatar: sender.avatar
          } : null
        };
      })
    );

    return NextResponse.json({
      success: true,
      notifications: notificationsWithSenders
    });
  } catch (error) {
    console.error("Notifications API error:", error);
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

    const { notificationId, action } = await request.json();

    if (!notificationId || !action) {
      return NextResponse.json(
        { success: false, message: "Notification ID and action are required" },
        { status: 400 }
      );
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
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

    // Verify the notification belongs to the current user
    if (notification.recipientId !== currentUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (action === 'mark_read') {
      notification.isRead = true;
      await notification.save();
    } else if (action === 'accept_connection') {
      notification.isAccepted = true;
      notification.isRead = true;
      await notification.save();

      // Add connection to both users
      const sender = await User.findById(notification.senderId);
      if (sender) {
        // Add to current user's connections
        if (!currentUser.connections) {
          currentUser.connections = [];
        }
        if (!currentUser.connections.includes(notification.senderId)) {
          currentUser.connections.push(notification.senderId);
          await currentUser.save();
        }

        // Add to sender's connections
        if (!sender.connections) {
          sender.connections = [];
        }
        if (!sender.connections.includes(currentUser._id.toString())) {
          sender.connections.push(currentUser._id.toString());
          await sender.save();
        }

        // Create acceptance notification for sender
        const acceptanceNotification = new Notification({
          recipientId: notification.senderId,
          senderId: currentUser._id.toString(),
          type: 'connection_accepted',
          title: 'Connection Accepted',
          message: `${currentUser.name} accepted your connection request`,
          data: {
            senderName: currentUser.name,
            senderEmail: currentUser.email,
            senderAvatar: currentUser.avatar
          }
        });
        await acceptanceNotification.save();
      }
    } else if (action === 'reject_connection') {
      notification.isAccepted = false;
      notification.isRead = true;
      await notification.save();
    }

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully"
    });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 