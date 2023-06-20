import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";
import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { Adapter } from "next-auth/adapters";
import Stripe from "stripe";
import docClient from "@/app/dynamodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2022-11-15",
});

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async signIn({ user }) {
			await stripe.customers
				.create({
					email: user.email!,
					name: user.name!,
				})
				.then(async (customer) => {
					const createUserParmas = {
						TableName: "stripe-customers",
						Item: {
							...customer,
						},
					};

					await docClient.send(new PutCommand(createUserParmas));
				});
			return true;
		},
	},

	// events: {
	// 	createUser: async ({ user }) => {
	// 		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// 			apiVersion: "2022-11-15",
	// 		});

	// 		await stripe.customers
	// 			.create({
	// 				email: user.email!,
	// 				name: user.name!,
	// 			})
	// 			.then(async (customer) => {
	// 				const createUserParams = {
	// 					TableName: "stripe-customers",
	// 					Item: { id: customer.id, email: customer.email },
	// 				};

	// 				await client.send(new PutCommand(createUserParams));
	// 			});
	// 	},
	// },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
