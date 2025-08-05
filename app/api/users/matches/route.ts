import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
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

    // Get all other users for matching
    const allUsers = await User.find({ 
      _id: { $ne: currentUser._id },
      isPublic: true 
    });

    // Calculate compatibility scores
    const matches = allUsers.map(user => {
      let score = 0;
      
      // Skill complementarity
      const skillMatch = currentUser.skills.filter(skill => 
        user.skills.includes(skill)
      ).length;
      const skillComplement = currentUser.lookingFor.filter(need => 
        user.skills.includes(need)
      ).length;
      score += (skillMatch * 2) + (skillComplement * 5);
      
      // Interest alignment
      const interestMatch = currentUser.interests.filter(interest => 
        user.interests.includes(interest)
      ).length;
      score += interestMatch * 3;
      
      // Experience diversity
      if (currentUser.experience !== user.experience) {
        score += 2;
      }
      
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
        compatibility: Math.min(score, 100)
      };
    });

    // Sort by compatibility and return top matches
    const topMatches = matches
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      matches: topMatches
    });
  } catch (error) {
    console.error("Matches API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 