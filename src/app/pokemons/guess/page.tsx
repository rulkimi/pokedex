import GuessClient from "./_components/guess-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Who's That Pokémon? | Pokédex by rulkimi",
	description: "Test your Pokemon knowledge by guessing Pokemon from their silhouettes!"
};

export default function GuessPage() {
	return (
		<Suspense fallback={<div className="w-full h-[50vh] flex items-center justify-center">Loading...</div>}>
			<GuessClient />
		</Suspense>
	);
}
