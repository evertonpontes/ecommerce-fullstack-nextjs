import NextAuth, { User } from 'next-auth';
import { encode as defaultEncode } from 'next-auth/jwt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import client from './lib/db';
import { getUserFromDb } from './actions/user.actions';
import { v4 as uuid } from 'uuid';

const adapter = MongoDBAdapter(client);

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  // https://authjs.dev/getting-started/authentication/oauth
  adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials!;

        const res = await getUserFromDb(email as string, password as string);

        if (res.success) {
          return res.data as User;
        }

        return null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  experimental: {
    enableWebAuthn: true,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  debug: true,
});
