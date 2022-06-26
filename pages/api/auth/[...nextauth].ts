import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import generator from "generate-password";
import { uid } from "uid";

const sha1 = require("js-sha1");

const prisma = new PrismaClient();

const password = generator.generate({
  length: 10,
  numbers: true,
  symbols: true,
});


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const userAlreadyExist = await prisma.accounts.findUnique({
        where: { email: `${user.email}` },
      });

      if (!userAlreadyExist) {
        try {
          await prisma.accounts.create({
            data: {
              name: `${user.name}#${uid(4)}`,
              email: `${user.email}`,
              password: `${sha1(password)}`,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }

      return true;
    },
  },
});
