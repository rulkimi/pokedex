"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPokemonById } from "../[gen]/actions";
import { toast } from "sonner";
import { PokemonDetail } from "../[gen]/actions";
import PokemonImage from "../[gen]/_components/pokemon-image";
import { motion, AnimatePresence } from "motion/react";
import { playPokemonCry, getGeneration, GENERATION_LIMITS } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Guess() {
	const [selectedGens, setSelectedGens] = useState<number[]>([1]);
	const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
	const [guess, setGuess] = useState("");
	const [score, setScore] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [showPokemon, setShowPokemon] = useState(false);

	const generateRandomPokemon = async () => {
		if (selectedGens.length === 0) {
			toast.error("Please select at least one generation");
			return;
		}

		// get random generation from selected gens
		const randomGenIndex = Math.floor(Math.random() * selectedGens.length);
		const gen = selectedGens[randomGenIndex];
		const { offset, limit } = getGeneration(gen);

		const randomId = Math.floor(Math.random() * limit) + offset + 1;
		const pokemon = await fetchPokemonById(randomId);
		setPokemon(pokemon);
		setGuess("");
		setAttempts(0);
		setShowPokemon(false);
	};

	const checkGuess = () => {
		if (!pokemon) return;

		setAttempts(prev => prev + 1);

		if (guess.toLowerCase() === pokemon.name.toLowerCase()) {
			setScore(prev => prev + 1);
			setShowPokemon(true);
			playPokemonCry(pokemon.id);
			toast.success("Correct!", {
				description: `You guessed it in ${attempts + 1} attempts!`,
			});
			setTimeout(() => {
				generateRandomPokemon();
			}, 2000);
		} else {
			toast.error("Wrong guess!", {
				description: "Try again!",
			});
		}
	};

	const toggleGeneration = (gen: number) => {
		setSelectedGens(prev => 
			prev.includes(gen) 
				? prev.filter(g => g !== gen)
				: [...prev, gen].sort((a, b) => a - b)
		);
	};

	const showAnswer = () => {
		if (!pokemon) return;
		setShowPokemon(true);
		playPokemonCry(pokemon.id);
		toast.info(`The answer is ${pokemon.name}!`);
		setTimeout(() => {
			generateRandomPokemon();
		}, 2000);
	};

	useEffect(() => {
		generateRandomPokemon();
	}, []);

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Who's That Pokemon?</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-2 items-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									Generations ({selectedGens.join(" | ")})
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{Object.keys(GENERATION_LIMITS).map((gen) => (
									<DropdownMenuCheckboxItem
										key={gen}
										checked={selectedGens.includes(Number(gen))}
										onCheckedChange={() => toggleGeneration(Number(gen))}
									>
										Gen {gen}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<Button onClick={generateRandomPokemon}>New Pokemon</Button>
					</div>

					{pokemon && (
						<div className="space-y-4">
							<div className="flex justify-center">
								<AnimatePresence mode="wait">
									{showPokemon ? (
										<motion.div
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1.2, opacity: 1 }}
											exit={{ scale: 0.8, opacity: 0 }}
											transition={{ duration: 0.3 }}
										>
											<PokemonImage
												pokemonId={pokemon.id}
												alt={pokemon.name}
												className="w-64 h-64 object-contain"
											/>
										</motion.div>
									) : (
										<PokemonImage
											pokemonId={pokemon.id}
											alt="Pokemon silhoutte"
											className="w-64 h-64 object-contain filter brightness-0"
										/>
									)}
								</AnimatePresence>
							</div>
							<div className="flex gap-2">
								<Input
									placeholder="Enter Pokemon name..."
									value={guess}
									onChange={(e) => setGuess(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && checkGuess()}
								/>
								<Button onClick={checkGuess}>Guess</Button>
								<Button variant="outline" onClick={showAnswer}>Show Answer</Button>
								<Button variant="outline" onClick={generateRandomPokemon}>Skip</Button>
							</div>
							<div className="text-center">
								<p>Score: {score}</p>
								<p>Attempts: {attempts}</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}