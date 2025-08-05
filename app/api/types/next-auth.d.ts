import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      subscription?: string | null;
    };
  }

  interface User {
    id: string;
    subscription?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}