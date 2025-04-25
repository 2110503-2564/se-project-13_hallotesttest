import { z } from 'zod'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import userLogIn from '@/libs/userLogIn'

// Define schema using zod
const credentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export const authOptions: AuthOptions = {
  pages: {
    signIn: 'login',
    signOut: 'logout',
    error: 'error',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const validatedCredentials = credentialsSchema.parse(credentials)

          const user = await userLogIn(validatedCredentials.email, validatedCredentials.password)
          if (user) {
            return user
          } else {
            return null
          }
        } catch (err) {
          console.error("Validation error:", err)
          throw new Error("Invalid email or password format")
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  }
}
