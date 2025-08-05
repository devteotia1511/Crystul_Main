import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
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

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const chatId = params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    if (!chat.participants.includes(currentUser._id.toString())) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    interface MessageType {
      id: string;
      content: string;
      senderId: string;
      timestamp: string;
      isRead: boolean;
      _id: string;
      messageType?: string;
    }

    chat.messages.forEach((message: MessageType) => {
      if (message.senderId !== currentUser._id.toString() && !message.isRead) {
        message.isRead = true;
      }
    });
    await chat.save();

    const messagesWithSenders = await Promise.all(
      chat.messages.map(async (message: MessageType) => {
        const sender = await User.findById(message.senderId);
        return {
          id: message._id.toString(),
          content: message.content,
          messageType: message.messageType,
          timestamp: message.timestamp,
          isRead: message.isRead,
          sender: sender
            ? {
                id: sender._id.toString(),
                name: sender.name,
                email: sender.email,
                avatar: sender.avatar,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      messages: messagesWithSenders,
    });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { content, messageType = "text" } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const chatId = params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    if (!chat.participants.includes(currentUser._id.toString())) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const newMessage = {
      senderId: currentUser._id.toString(),
      content: content,
      messageType: messageType,
      timestamp: new Date(),
      isRead: false,
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    await chat.save();

    // ✅ Get the latest message (which now has _id)
    const savedMessage = chat.messages.at(-1); // or use chat.messages[chat.messages.length - 1];

    const messageWithSender = {
      id: savedMessage._id.toString(),
      content: savedMessage.content,
      messageType: savedMessage.messageType,
      timestamp: savedMessage.timestamp,
      isRead: savedMessage.isRead,
      sender: {
        id: currentUser._id.toString(),
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
    };

    return NextResponse.json({
      success: true,
      message: messageWithSender,
    });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}