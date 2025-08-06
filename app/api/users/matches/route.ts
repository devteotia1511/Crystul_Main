import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = 'force-dynamic';
interface UserDocument {
  _id: any;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  experience: string;
  bio?: string;
  location?: string;
  isPublic: boolean;
  lookingFor: string[];
}

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
    const currentUser = await User.findOne({ email: session.user.email }) as UserDocument | null;
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
    }) as UserDocument[];

    // Calculate compatibility scores
    const matches = allUsers.map((user: UserDocument) => {
      let score = 0;
      
      // Skill complementarity - ensure arrays exist and are arrays
      const currentUserSkills = Array.isArray(currentUser.skills) ? currentUser.skills : [];
      const userSkills = Array.isArray(user.skills) ? user.skills : [];
      const currentUserLookingFor = Array.isArray(currentUser.lookingFor) ? currentUser.lookingFor : [];
      
      const skillMatch = currentUserSkills.filter((skill: string) => 
        userSkills.includes(skill)
      ).length;
      
      const skillComplement = currentUserLookingFor.filter((need: string) => 
        userSkills.includes(need)
      ).length;
      
      score += (skillMatch * 2) + (skillComplement * 5);
      
      // Interest alignment - ensure arrays exist and are arrays
      const currentUserInterests = Array.isArray(currentUser.interests) ? currentUser.interests : [];
      const userInterests = Array.isArray(user.interests) ? user.interests : [];
      
      const interestMatch = currentUserInterests.filter((interest: string) => 
        userInterests.includes(interest)
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
        skills: userSkills,
        interests: userInterests,
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