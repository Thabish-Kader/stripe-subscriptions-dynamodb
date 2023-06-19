import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { Adapter } from "next-auth/adapters";
import prisma from "../../../../../prisma/prisma";
import Stripe from "stripe";
import docClient from "@/app/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async session({ session, user }) {
			session!.user!.id = user.id;
			session!.user!.stripeCustomerId = user.stripeCustomerId;
			session!.user!.isActive = user.isActive;
			return session;
		},
	},

	events: {
		createUser: async ({ user }) => {
			console.log("Stripe Trigger");
			const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
				apiVersion: "2022-11-15",
			});
			console.log("Customer Trigger");

			await stripe.customers
				.create({
					email: user.email!,
					name: user.name!,
				})
				.then(async (customer) => {
					const createUserParmas = {
						TableName: "stripe-customers",
						Item: { id: customer.id, email: customer.email },
					};

					return docClient.send(new PutCommand(createUserParmas));
				});
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
