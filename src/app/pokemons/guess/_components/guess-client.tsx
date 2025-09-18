"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPokemonById } from "../../[gen]/actions";
import { playPokemonCry, getGeneration, getPokemonGen } from "@/lib/utils";
import PokemonView from "./pokemon-view";
import GenSelector from "./gen-selector";
import { PokemonDetail } from "../../[gen]/actions";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, Eye, SkipForward, CheckCircle, XCircle, Info } from "lucide-react";

type Message = {
	type: "success" | "error" | "info";
	title: string;
	description?: string;
};

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function GuessClient() {
	const [selectedGens, setSelectedGens] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
	const [guess, setGuess] = useState("");
	const [score, setScore] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [showPokemon, setShowPokemon] = useState(false);
	const [hint, setHint] = useState("");
	const [message, setMessage] = useState<Message | null>(null);
	const [showAnswerState, setShowAnswerState] = useState(false);
	const [showWrongAnswer, setShowWrongAnswer] = useState(false);
	const attemptsRef = useRef(0);

	// Helper to get a random pokemon from selected gens only
	const getRandomPokemonFromSelectedGens = async () => {
		if (selectedGens.length === 0) {
			setMessage({
				type: "error",
				title: "No Generations Selected",
				description: "Please select at least one generation.",
			});
			return null;
		}
		// Pick a random gen from selected
		const gen = selectedGens[getRandomInt(0, selectedGens.length - 1)];
		const { offset, limit } = getGeneration(gen);
		const randomId = getRandomInt(offset + 1, offset + limit);
		const poke = await fetchPokemonById(randomId);
		// Defensive: If the fetched pokemon is not in selected gens, try again (shouldn't happen, but just in case)
		if (poke && selectedGens.includes(getPokemonGen(poke.id))) {
			return poke;
		} else {
			// Try again recursively, but avoid infinite loop
			return getRandomPokemonFromSelectedGens();
		}
	};

	const generateRandomPokemon = async () => {
		const newPokemon = await getRandomPokemonFromSelectedGens();
		setPokemon(newPokemon);
		setGuess("");
		setAttempts(0);
		attemptsRef.current = 0;
		setShowPokemon(false);
		setHint("");
		setMessage(null);
		setShowAnswerState(false);
		setShowWrongAnswer(false);
	};

	const checkGuess = () => {
		if (!pokemon) return;
		const normalizedGuess = guess.trim().toLowerCase();
		const normalizedName = pokemon.name.toLowerCase();

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);
		attemptsRef.current = newAttempts;

		if (normalizedGuess === normalizedName) {
			setScore(prev => prev + 1);
			playPokemonCry(pokemon.id);
			setShowPokemon(true);
			setMessage({
				type: "success",
				title: "Correct!",
				description: `You guessed it in ${newAttempts} attempt${newAttempts === 1 ? "" : "s"}!`,
			});
			setShowAnswerState(true);
			setShowWrongAnswer(false);
			setTimeout(() => {
				setMessage(null);
				generateRandomPokemon();
			}, 2000);
		} else {
			setMessage({
				type: "error",
				title: "Wrong guess!",
				description: "Try again!",
			});
			setShowWrongAnswer(true);
			// Hide the wrong answer message after 1.5s
			setTimeout(() => {
				setShowWrongAnswer(false);
				setMessage(null);
			}, 1500);
		}
	};

	const showAnswer = () => {
		if (!pokemon) return;
		playPokemonCry(pokemon.id);
		setShowPokemon(true);
		setShowAnswerState(true);
		setMessage({
			type: "info",
			title: "The answer is revealed!",
			description: `It's ${pokemon.name}!`,
		});
		setTimeout(() => {
			setMessage(null);
			generateRandomPokemon();
		}, 2000);
	};

	const showHint = () => {
		if (!pokemon) return;
		const hints = [
			`This Pokémon is from Generation ${getPokemonGen(pokemon.id)}`,
			`It's a ${pokemon.types.join(" and ")} type`,
			`First letter is "${pokemon.name[0]}"`,
			`Last letter is "${pokemon.name[pokemon.name.length - 1]}"`,
			`It has ${pokemon.name.length} letters`
		];
		const randomHint = hints[getRandomInt(0, hints.length - 1)];
		setHint(randomHint);
	};

	useEffect(() => {
		generateRandomPokemon();
		// eslint-disable-next-line
	}, []);

	const renderMessage = () => {
		if (!message) return null;
		let icon = null;
		let color = "";
		if (message.type === "success") {
			icon = <CheckCircle className="text-green-500 mr-2" />;
			color = "bg-green-50 border-green-200 text-green-800";
		} else if (message.type === "error") {
			icon = <XCircle className="text-red-500 mr-2" />;
			color = "bg-red-50 border-red-200 text-red-800";
		} else {
			icon = <Info className="text-blue-500 mr-2" />;
			color = "bg-blue-50 border-blue-200 text-blue-800";
		}
		return (
			<div
				className={`max-w-lg mx-auto flex items-center gap-2 border rounded-lg px-4 py-2 mt-2 mb-2 shadow-sm transition-all ${color}`}
				role="alert"
			>
				{icon}
				<div>
					<div className="font-semibold">{message.title}</div>
					{message.description && (
						<div className="text-sm">{message.description}</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="container max-w-4xl mx-auto p-2 sm:p-4">
			<Card>
				<CardHeader className="text-center border-b pb-4 sm:pb-6">
					<CardTitle className="text-2xl sm:text-3xl font-bold">
						Who's That Pokémon?
					</CardTitle>
					<div className="flex sm:flex-row justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
						<Badge variant="secondary" className="text-base sm:text-lg">Score: {score}</Badge>
						<Badge variant="secondary" className="text-base sm:text-lg">Attempts: {attempts}</Badge>
					</div>
				</CardHeader>
				<CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
						<GenSelector selectedGens={selectedGens} setSelectedGens={setSelectedGens} />
						<Button onClick={generateRandomPokemon} className="w-full sm:w-auto">
							<RefreshCw className="mr-2 h-4 w-4" /> New Pokémon
						</Button>
					</div>

					{pokemon && (
						<div className="space-y-4 sm:space-y-6">
							<div className="relative">
								<PokemonView pokemon={pokemon} show={showPokemon} />
								{hint && (
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600/80 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
										{hint}
									</div>
								)}
							</div>

							{showAnswerState ? (
								renderMessage()
							) : (
								<div className="flex flex-col gap-2 sm:gap-3">
									<div className="flex gap-2 max-w-md mx-auto w-full">
										<Input
											placeholder="Enter Pokémon name..."
											value={guess}
											onChange={(e) => setGuess(e.target.value)}
											onKeyDown={(e) => e.key === "Enter" && checkGuess()}
											className="flex-1"
											disabled={showAnswerState}
										/>
										<Button onClick={checkGuess} disabled={showAnswerState}>Guess</Button>
									</div>
									{showWrongAnswer && (
										<div className="flex justify-center">
											<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-2 mt-2 shadow-sm transition-all">
												<XCircle className="text-red-500" />
												<span>Wrong guess! Try again!</span>
											</div>
										</div>
									)}
									<div className="flex flex-wrap gap-2 justify-center">
										<Button
											variant="outline"
											onClick={showHint}
											className="flex-1 sm:flex-none"
											disabled={showAnswerState}
										>
											<Lightbulb className="mr-2 h-4 w-4" /> Hint
										</Button>
										<Button
											variant="outline"
											onClick={showAnswer}
											className="flex-1 sm:flex-none"
											disabled={showAnswerState}
										>
											<Eye className="mr-2 h-4 w-4" /> Show Answer
										</Button>
										<Button
											variant="outline"
											onClick={generateRandomPokemon}
											className="flex-1 sm:flex-none"
										>
											<SkipForward className="mr-2 h-4 w-4" /> Skip
										</Button>
									</div>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
