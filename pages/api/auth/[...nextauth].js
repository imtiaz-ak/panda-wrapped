import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly",
          }
        },
        
    })
  ],

  callbacks: {
    async jwt({ token, account }) {  
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  }
})