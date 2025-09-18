"use client";

import { useState, useEffect } from "react";
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

	const generateRandomPokemon = async () => {
		if (selectedGens.length === 0) {
			setMessage({
				type: "error",
				title: "No Generations Selected",
				description: "Please select at least one generation.",
			});
			return;
		}
		const gen = selectedGens[Math.floor(Math.random() * selectedGens.length)];
		const { offset, limit } = getGeneration(gen);
		const randomId = Math.floor(Math.random() * limit) + offset + 1;
		const newPokemon = await fetchPokemonById(randomId);
		setPokemon(newPokemon);
		setGuess("");
		setAttempts(0);
		setShowPokemon(false);
		setHint("");
		setMessage(null);
		setShowAnswerState(false);
	};

	const checkGuess = () => {
		if (!pokemon) return;
		setAttempts(prev => prev + 1);

		if (guess.trim().toLowerCase() === pokemon.name.toLowerCase()) {
			setScore(prev => prev + 1);
			playPokemonCry(pokemon.id);
			setShowPokemon(true);
			setMessage({
				type: "success",
				title: "Correct!",
				description: `You guessed it in ${attempts + 1} attempt${attempts + 1 === 1 ? "" : "s"}!`,
			});
			setShowAnswerState(true);
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
		const randomHint = hints[Math.floor(Math.random() * hints.length)];
		setHint(randomHint);
		// setMessage({
		// 	type: "info",
		// 	title: "Hint",
		// 	description: randomHint,
		// });
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
                {/* {showAnswerState && pokemon && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-white" />
                      The answer is <span className="ml-1 font-bold">{pokemon.name}</span>!
                    </div>
                  </div>
                )} */}
              </div>
            )}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
