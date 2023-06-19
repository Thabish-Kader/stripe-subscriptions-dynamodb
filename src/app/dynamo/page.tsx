"use client";
import React from "react";
import docClient from "@/app/dynamodb";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
const Dynamo = () => {
	const update = () => {
		const createUserParmas = {
			TableName: "stripe-customers",
			Key: { id: "dddd" },
			UpdateExpression: "SET isActive = :isActiveValue",
			ExpressionAttributeValues: {
				":isActiveValue": false,
			},
		};

		return docClient.send(new UpdateCommand(createUserParmas));
	};

	const create = () => {
		const createUserParmas = {
			TableName: "stripe-customers",
			Item: { id: "dddd", email: "test@email.com", isActive: true },
		};

		return docClient.send(new PutCommand(createUserParmas));
	};
	return (
		<div>
			<h1>Clikc to check</h1>
			<button onClick={create}>Create</button>
			<button onClick={update}>Update</button>
		</div>
	);
};

export default Dynamo;
