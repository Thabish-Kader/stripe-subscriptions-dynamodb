"use client";
import { useRouter } from "next/navigation";
import LoginBtn from "../components/login-btn";
import { baseBtnStyle } from "../subscription/page";
import getStripe from "../utils/getStripe";
import { useSession } from "next-auth/react";

export default function Page() {
	const router = useRouter();
	const { data: session } = useSession();
	console.log(session);
	const handleDeleteSubscription = async (productId: string) => {
		const res = await fetch(`/api/stripe/subscription-cancel`, {
			method: "POST",
			body: JSON.stringify({ productId }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const subscription = await res.json().then((value) => {
			return value.subscription;
		});

		const stripe = await getStripe();
		router.push("/subscription");
	};

	return (
		<div className="p-5 border-2 mt-4 mx-3 text-center">
			<button
				className={baseBtnStyle}
				onClick={() =>
					handleDeleteSubscription("price_1NJBYWSHIgwKaeEw72NKg9S1")
				}
			>
				Delete Subscription
			</button>
		</div>
	);
}
