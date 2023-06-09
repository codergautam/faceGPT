import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createUser, userExists } from "../../../db/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // save the username
      if (token) {
        token.username = token.email.split("@")[0]
        const fname = token.name.split(" ")[0]
        // format the name properly
        token.fname = fname[0].toUpperCase() + fname.slice(1).toLowerCase()
      }
      return token
    },
    async session({ session, token }) {
      session.username = token.username
      session.fname = token.fname

      let id = await userExists(token.email);
      if (!id) {
        id = await createUser({ username: token.fname, email: token.email })
      }
      session.id = id;
      return session
    }
  },
}

export default NextAuth(authOptions)