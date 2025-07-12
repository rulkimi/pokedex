"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchPokemonById } from "../../[gen]/actions";
import { playPokemonCry, getGeneration, getPokemonGen } from "@/lib/utils";
import PokemonView from "./pokemon-view";
import GenSelector from "./gen-selector";
import { PokemonDetail } from "../../[gen]/actions";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, Eye, SkipForward } from "lucide-react";

export default function GuessClient() {
	const [selectedGens, setSelectedGens] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
	const [guess, setGuess] = useState("");
	const [score, setScore] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [showPokemon, setShowPokemon] = useState(false);
	const [hint, setHint] = useState("");

	const generateRandomPokemon = async () => {
		if (selectedGens.length === 0) {
			toast.error("Please select at least one generation");
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
	};

	const checkGuess = () => {
		if (!pokemon) return;
		setAttempts(prev => prev + 1);

		if (guess.trim().toLowerCase() === pokemon.name.toLowerCase()) {
			setScore(prev => prev + 1);
			playPokemonCry(pokemon.id);
			setShowPokemon(true);
			toast.success("Correct!", {
				description: `You guessed it in ${attempts + 1} attempts!`,
			});
			setTimeout(generateRandomPokemon, 2000);
		} else {
			toast.error("Wrong guess!", { description: "Try again!" });
		}
	};

	const showAnswer = () => {
		if (!pokemon) return;
		playPokemonCry(pokemon.id);
		setShowPokemon(true);
		toast.info(`The answer is ${pokemon.name}!`);
		setTimeout(generateRandomPokemon, 2000);
	};

	const showHint = () => {
		if (!pokemon) return;
		const hints = [
			`This Pokemon is from Generation ${getPokemonGen(pokemon.id)}`,
			`It's a ${pokemon.types.join(" and ")} type`,
			`First letter is "${pokemon.name[0]}"`,
			`Last letter is "${pokemon.name[pokemon.name.length - 1]}"`,
			`It has ${pokemon.name.length} letters`
		];
		const randomHint = hints[Math.floor(Math.random() * hints.length)];
		setHint(randomHint);
		toast.info("Here's a hint!", { description: randomHint });
	};

	useEffect(() => {
		generateRandomPokemon();
	}, []);

	return (
		<div className="container max-w-4xl mx-auto p-2 sm:p-4">
			<Card>
				<CardHeader className="text-center border-b pb-4 sm:pb-6">
					<CardTitle className="text-2xl sm:text-3xl font-bold">
						Who's That Pokemon?
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
							<RefreshCw className="mr-2 h-4 w-4" /> New Pokemon
						</Button>
					</div>

					{pokemon && (
						<div className="space-y-4 sm:space-y-6">
							<div className="relative">
								<PokemonView pokemon={pokemon} show={showPokemon} />
								{hint && (
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
										{hint}
									</div>
								)}
							</div>

							<div className="flex flex-col gap-2 sm:gap-3">
								<div className="flex gap-2 max-w-md mx-auto w-full">
									<Input
										placeholder="Enter Pokemon name..."
										value={guess}
										onChange={(e) => setGuess(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && checkGuess()}
										className="flex-1"
									/>
									<Button onClick={checkGuess}>Guess</Button>
								</div>
								<div className="flex flex-wrap gap-2 justify-center">
									<Button variant="outline" onClick={showHint} className="flex-1 sm:flex-none">
										<Lightbulb className="mr-2 h-4 w-4" /> Hint
									</Button>
									<Button variant="outline" onClick={showAnswer} className="flex-1 sm:flex-none">
										<Eye className="mr-2 h-4 w-4" /> Show Answer
									</Button>
									<Button variant="outline" onClick={generateRandomPokemon} className="flex-1 sm:flex-none">
										<SkipForward className="mr-2 h-4 w-4" /> Skip
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
