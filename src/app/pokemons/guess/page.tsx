import GuessClient from "./_components/guess-client";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Who's That Pokemon?",
	description: "Test your Pokemon knowledge by guessing Pokemon from their silhouettes!"
};

export default function GuessPage() {
	return <GuessClient />;
}
