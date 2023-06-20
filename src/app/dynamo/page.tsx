"use client";
import React from "react";
import docClient from "@/app/dynamodb";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { useSession } from "next-auth/react";
import { TCustomer } from "../../../types";
const Dynamo = () => {
	const { data: session } = useSession();
	const update = () => {
		const updateUserParmas = {
			TableName: "product-vision-customers",
			Key: { id: "dddd" },
			UpdateExpression: "SET isActive = :isActiveValue",
			ExpressionAttributeValues: {
				":isActiveValue": false,
			},
		};

		return docClient.send(new UpdateCommand(updateUserParmas));
	};

	const create = () => {
		const createUserParmas = {
			TableName: "product-vision-customers",
			Item: { email: "test@email.com", isActive: true, incvoice: "ssss" },
		};

		return docClient.send(new PutCommand(createUserParmas));
	};

	const read = async () => {
		const queryUserParams = {
			TableName: "product-vision-customers",
			KeyConditionExpression: "email = :email",
			ExpressionAttributeValues: {
				":email": session?.user?.email,
			},
		};

		const exisitngUser = await docClient.send(
			new QueryCommand(queryUserParams)
		);

		const items = exisitngUser.Items as TCustomer[];

		console.log(items.length);
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
