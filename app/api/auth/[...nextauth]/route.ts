import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getRequiredEnvVar } from "@/lib/env-validation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getRequiredEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnvVar("GOOGLE_CLIENT_SECRET"),
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const dbConnection = await dbConnect();
          
          // If no database connection (development with placeholder), allow demo login
          if (!dbConnection) {
            console.warn('⚠️  No database connection in development, allowing demo login');
            // For development, allow any email/password combination
            return {
              id: 'demo-user',
              email: credentials.email,
              name: 'Demo User',
              image: null
            };
          }
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const dbConnection = await dbConnect();
        if (dbConnection) {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              skills: [],
              interests: [],
              experience: 'Beginner',
              lookingFor: [],
              isPublic: true,
              createdAt: new Date(),
            });
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };