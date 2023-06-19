"use client";
import React from "react";
import docClient from "@/app/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
const Dynamo = () => {
	const dynamoCheck = () => {
		const createUserParmas = {
			TableName: "stripe-customers",
			Item: { id: "dddd", email: "test@email.com", isActive: true },
		};

		return docClient.send(new PutCommand(createUserParmas));
	};
	return (
		<div>
			<h1>Clikc to check</h1>
			<button onClick={dynamoCheck}>Check</button>
		</div>
	);
};

export default Dynamo;
