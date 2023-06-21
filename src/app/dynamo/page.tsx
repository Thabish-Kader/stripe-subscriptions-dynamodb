"use client";
import React from "react";
import docClient from "@/app/dynamodb";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { useSession } from "next-auth/react";
import { TCustomer } from "../../../types";
const Dynamo = () => {
	const { data: session } = useSession();
	const update = async () => {
		const updateUserParmas = {
			TableName: "product-vision-customers",
			Key: { email: session?.user?.email },
			UpdateExpression: "SET isActive = :isActive",
			ExpressionAttributeValues: {
				":isActive": true,
			},
		};

		await docClient.send(new UpdateCommand(updateUserParmas));
	};

	const create = async () => {
		const createUserParmas = {
			TableName: "proto",
			Item: { ...session?.user },
		};

		await docClient.send(new PutCommand(createUserParmas));
	};

	const read = async () => {
		const queryUserParams = {
			TableName: "product-vision-customers",
			KeyConditionExpression: "email = :email and id = :id",
			ExpressionAttributeValues: {
				":email": session?.user?.email,
				":id": session?.user?.stripeCustomerId,
			},
		};

		const exisitngUser = await docClient.send(
			new QueryCommand(queryUserParams)
		);

		const items = exisitngUser.Items as TCustomer[];
		console.log(items);
	};

	return (
		<div className="flex flex-col  ">
			<button onClick={create}>Create</button>
			<button onClick={update}>Update</button>
			<button onClick={read}>Read</button>
		</div>
	);
};

export default Dynamo;
