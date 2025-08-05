import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";

// Define the expected shape of a message
type Message = {
  senderId: string;
  content: string;
  messageType: string;
  timestamp: Date;
  isRead?: boolean;
};

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

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const chatType = searchParams.get("type");
    const teamId = searchParams.get("teamId");
    const otherUserId = searchParams.get("userId");

    let query: any = {
      participants: currentUser._id.toString(),
      isActive: true
    };

    if (chatType === "direct" && otherUserId) {
      query.participants = {
        $all: [currentUser._id.toString(), otherUserId]
      };
      query.chatType = "direct";
    } else if (chatType === "team" && teamId) {
      query.teamId = teamId;
      query.chatType = "team";
    }

    const chats = await Chat.find(query).sort({ lastMessage: -1 });

    const chatsWithParticipants = await Promise.all(
      chats.map(async (chat) => {
        const participants = await User.find({
          _id: { $in: chat.participants }
        });

        // Ensure TypeScript knows chat.messages is an array of Message
        const messages: Message[] = chat.messages;

        return {
          id: chat._id.toString(),
          chatType: chat.chatType,
          teamId: chat.teamId,
          participants: participants.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            email: p.email,
            avatar: p.avatar
          })),
          lastMessage: chat.lastMessage,
          messageCount: messages.length,
          unreadCount: messages.filter(
            (m: Message) =>
              !m.isRead && m.senderId !== currentUser._id.toString()
          ).length
        };
      })
    );

    return NextResponse.json({
      success: true,
      chats: chatsWithParticipants
    });
  } catch (error) {
    console.error("Chat API error:", error);
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

    const { participants, chatType, teamId, message } = await request.json();

    if (!participants || !chatType) {
      return NextResponse.json(
        {
          success: false,
          message: "Participants and chat type are required"
        },
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

    const allParticipants = Array.from(new Set([...participants, currentUser._id.toString()]));

    let chat = await Chat.findOne({
      participants: { $all: allParticipants },
      chatType: chatType,
      teamId: teamId || null
    });

    if (!chat) {
      chat = new Chat({
        participants: allParticipants,
        chatType: chatType,
        teamId: teamId || null,
        messages: []
      });
    }

    if (message) {
      chat.messages.push({
        senderId: currentUser._id.toString(),
        content: message,
        messageType: "text",
        timestamp: new Date()
      });
      chat.lastMessage = new Date();
    }

    await chat.save();

    return NextResponse.json({
      success: true,
      chat: {
        id: chat._id.toString(),
        chatType: chat.chatType,
        teamId: chat.teamId,
        participants: allParticipants,
        lastMessage: chat.lastMessage
      }
    });
  } catch (error) {
    console.error("Chat creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}