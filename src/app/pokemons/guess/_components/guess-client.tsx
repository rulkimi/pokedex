"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPokemonById } from "../../[gen]/actions";
import { playPokemonCry, getGeneration, getPokemonGen, getArrangedTypes, getTypeColor } from "@/lib/utils";
import PokemonView from "./pokemon-view";
import GenSelector from "./gen-selector";
import { PokemonDetail } from "../../[gen]/actions";
import { Lightbulb, RefreshCw, Eye, SkipForward, CheckCircle, XCircle, Info } from "lucide-react";
import { motion } from "motion/react";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Message = {
	type: "success" | "error" | "info";
	title: string;
	description?: string;
};

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

type HistoryItem = {
	id: string;
	pokemonId: number;
	pokemonName: string;
	guessedName: string;
	isCorrect: boolean;
	timestamp: number;
};

export default function GuessClient() {
	const [selectedGens, setSelectedGens] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
	const [guess, setGuess] = useState("");
	
	const [score, setScore] = useState(0);
	const [attempts, setAttempts] = useState(0);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	
	const [showPokemon, setShowPokemon] = useState(false);
	const [hint, setHint] = useState("");
	const [message, setMessage] = useState<Message | null>(null);
	const [showAnswerState, setShowAnswerState] = useState(false);
	const attemptsRef = useRef(0);
	const [isLoaded, setIsLoaded] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Helper to get a random pokemon from selected gens only
	const getRandomPokemonFromSelectedGens = async (gensToUse: number[], currentId?: number): Promise<PokemonDetail | null> => {
		if (gensToUse.length === 0) {
			setMessage({
				type: "error",
				title: "No Generations Selected",
				description: "Please select at least one generation.",
			});
			return null;
		}
		const gen = gensToUse[getRandomInt(0, gensToUse.length - 1)];
		const { offset, limit } = getGeneration(gen);
		const randomId = getRandomInt(offset + 1, offset + limit);
		
		// If we picked the exact same pokemon we are currently on, try again
		if (currentId && randomId === currentId) {
			return getRandomPokemonFromSelectedGens(gensToUse, currentId);
		}

		const poke = await fetchPokemonById(randomId);
		if (poke && gensToUse.includes(getPokemonGen(poke.id))) {
			return poke;
		} else {
			return getRandomPokemonFromSelectedGens(gensToUse, currentId);
		}
	};

	const generateRandomPokemon = async (overrideGens?: number[]) => {
		const gensToUse = overrideGens || selectedGens;
		const newPokemon = await getRandomPokemonFromSelectedGens(gensToUse, pokemon?.id);
		setPokemon(newPokemon);
		setGuess("");
		setAttempts(0);
		attemptsRef.current = 0;
		setShowPokemon(false);
		setHint("");
		setMessage(null);
		setShowAnswerState(false);
		setTimeout(() => inputRef.current?.focus(), 100);
	};

	const checkGuess = () => {
		if (!pokemon) return;
		
		const removeAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		const strip = (s: string) => s.replace(/[^a-z0-9]/g, "");

		const n = removeAccents(pokemon.name.toLowerCase());
		const g = removeAccents(guess.toLowerCase().trim());

		let isCorrect = false;

		if (n === g) {
			isCorrect = true;
		} else if (strip(n) === strip(g)) {
			isCorrect = true;
		} else {
			const exceptions = [
				'ho-oh', 'porygon-z', 'jangmo-o', 'hakamo-o', 'kommo-o', 
				'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 
				'type-null', 'chi-yu', 'ting-lu', 'wo-chien', 'chien-pao', 
				'mr-mime', 'mr-rime', 'mime-jr', 'great-tusk', 'scream-tail',
				'brute-bonnet', 'flutter-mane', 'slither-wing', 'sandy-shocks',
				'roaring-moon', 'iron-treads', 'iron-bundle', 'iron-hands',
				'iron-jugulis', 'iron-moth', 'iron-thorns', 'iron-valiant',
				'walking-wake', 'iron-leaves', 'gouging-fire', 'raging-bolt',
				'iron-boulder', 'iron-crown'
			];

			const matchedException = exceptions.find(ex => n === ex || n.startsWith(ex + '-'));
			
			if (matchedException) {
				if (strip(matchedException) === strip(g)) {
					isCorrect = true;
				}
			} else if (n.includes('-')) {
				const baseName = n.split('-')[0];
				if (strip(baseName) === strip(g)) {
					isCorrect = true;
				}
			}
		}

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);
		attemptsRef.current = newAttempts;

		const newHistoryItem: HistoryItem = {
			id: Date.now().toString(),
			pokemonId: pokemon.id,
			pokemonName: pokemon.name,
			guessedName: guess.trim(),
			isCorrect,
			timestamp: Date.now()
		};
		const newHistory = [newHistoryItem, ...history].slice(0, 50); // keep last 50
		setHistory(newHistory);
		localStorage.setItem("guessHistory", JSON.stringify(newHistory));

		if (isCorrect) {
			const newScore = score + 1;
			setScore(newScore);
			localStorage.setItem("guessScore", newScore.toString());
			playPokemonCry(pokemon.id);
			setShowPokemon(true);
			setMessage({
				type: "success",
				title: "Correct!",
				description: `You guessed it in ${newAttempts} attempt${newAttempts === 1 ? "" : "s"}!`,
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
			setTimeout(() => {
				setMessage(null);
			}, 1500);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 10);
		}
	};

	const showAnswer = () => {
		if (!pokemon) return;
		playPokemonCry(pokemon.id);
		setShowPokemon(true);
		setShowAnswerState(true);

		const newHistoryItem: HistoryItem = {
			id: Date.now().toString(),
			pokemonId: pokemon.id,
			pokemonName: pokemon.name,
			guessedName: "[Revealed Answer]",
			isCorrect: false,
			timestamp: Date.now()
		};
		const newHistory = [newHistoryItem, ...history].slice(0, 50);
		setHistory(newHistory);
		localStorage.setItem("guessHistory", JSON.stringify(newHistory));

		setMessage({
			type: "info",
			title: "The answer is revealed!",
			description: `It's ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}!`,
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
		let initialGens = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		try {
			const storedGens = localStorage.getItem("selectedGens");
			if (storedGens) {
				const parsed = JSON.parse(storedGens);
				if (Array.isArray(parsed) && parsed.length > 0) initialGens = parsed;
			}
			const storedScore = localStorage.getItem("guessScore");
			if (storedScore) setScore(parseInt(storedScore) || 0);
			const storedHistory = localStorage.getItem("guessHistory");
			if (storedHistory) setHistory(JSON.parse(storedHistory) || []);
		} catch {}
		
		setSelectedGens(initialGens);
		generateRandomPokemon(initialGens);
		setIsLoaded(true);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem("selectedGens", JSON.stringify(selectedGens));
		}
	}, [selectedGens, isLoaded]);

	const renderMessage = () => {
		if (!message) return null;
		let icon = null;
		let color = "";
		if (message.type === "success") {
			icon = <CheckCircle className="text-green-500 mr-2 shrink-0" />;
			color = "bg-green-50 border-green-200 text-green-800";
		} else if (message.type === "error") {
			icon = <XCircle className="text-red-500 mr-2 shrink-0" />;
			color = "bg-red-50 border-red-200 text-red-800";
		} else {
			icon = <Info className="text-blue-500 mr-2 shrink-0" />;
			color = "bg-blue-50 border-blue-200 text-blue-800";
		}
		return (
			<div className="absolute bottom-6 left-6 z-50 w-full max-w-xs pointer-events-none">
				<div
					className={`flex items-center gap-3 border rounded-lg px-4 py-3 transition-all animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300 pointer-events-auto bg-background/95 backdrop-blur shadow-sm ${color}`}
					role="alert"
				>
					{icon}
					<div className="flex flex-col text-left">
						<span className="font-semibold">{message.title}</span>
						{message.description && (
							<span className="text-sm">{message.description}</span>
						)}
					</div>
				</div>
			</div>
		);
	};

	const getBannerColor = () => {
		if (showPokemon && pokemon) {
			const arrangedTypes = getArrangedTypes(pokemon.types);
			return getTypeColor(arrangedTypes[0]);
		}
		return "bg-slate-800 dark:bg-slate-900"; // Default neutral color when hidden
	};

	const resetGame = () => {
		setScore(0);
		setHistory([]);
		localStorage.removeItem("guessScore");
		localStorage.removeItem("guessHistory");
		generateRandomPokemon();
	};

	// Group history by Pokemon ID
	const groupedHistory = Object.values(
		history.reduce((acc, item) => {
			if (!acc[item.pokemonId]) {
				acc[item.pokemonId] = {
					pokemonId: item.pokemonId,
					pokemonName: item.pokemonName,
					timestamp: item.timestamp,
					isSolved: false,
					attempts: []
				};
			}
			acc[item.pokemonId].attempts.push(item);
			if (item.isCorrect || item.guessedName === "[Revealed Answer]") {
				acc[item.pokemonId].isSolved = true;
			}
			return acc;
		}, {} as Record<number, { pokemonId: number, pokemonName: string, timestamp: number, isSolved: boolean, attempts: HistoryItem[] }>)
	).sort((a, b) => b.timestamp - a.timestamp);

	return (
		<div className="relative w-full min-h-screen lg:min-h-0 lg:h-[calc(100dvh-190px)] flex flex-col lg:flex-row bg-background lg:overflow-hidden rounded-3xl border border-border/50">
			
			{/* LEFT COLUMN (Guessing Area) */}
			<div className="flex flex-col w-full lg:w-2/3 lg:border-r border-border/50 bg-background flex-grow lg:overflow-hidden relative rounded-l-3xl">
				{/* Top Banner (Color + Background Elements + Pokemon) */}
				<motion.div 
					className={`relative z-0 pt-4 pb-4 px-4 m-3 sm:m-4 flex flex-col items-center justify-center transition-colors duration-700 ease-in-out rounded-[2rem] shadow-sm overflow-hidden flex-1 min-h-[150px] ${getBannerColor()}`}
				>
					{renderMessage()}
					<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="absolute -right-8 top-4 w-64 h-64 opacity-[0.15] text-white rotate-12 pointer-events-none">
						<circle cx="50" cy="50" r="40" />
						<circle cx="50" cy="50" r="12" />
						<path d="M10 50 H38" />
						<path d="M62 50 H90" />
					</svg>

					<div className="w-full max-w-4xl flex justify-between items-start z-10 text-white/90 mb-2">
						<div className="flex flex-col gap-1">
							<motion.h2 
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className="text-2xl sm:text-3xl font-extrabold tracking-tight capitalize"
							>
								{showPokemon && pokemon ? pokemon.name : "Who's That Pokémon?"}
							</motion.h2>
							
							<div className="flex gap-2 h-6 mt-1">
								{showPokemon && pokemon && getArrangedTypes(pokemon.types).map((type, index) => (
									<motion.span
										key={index}
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 400 }}
										className="bg-white/20 backdrop-blur-md border border-white/30 px-2 py-0.5 rounded-full text-white text-[10px] font-bold tracking-widest uppercase"
									>
										{type}
									</motion.span>
								))}
							</div>
						</div>
						
						<div className="flex flex-col items-end gap-1 font-bold opacity-90 pt-1">
							<motion.span 
								initial={{ x: 20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								className="text-xl sm:text-2xl font-bold opacity-80"
							>
								{showPokemon && pokemon ? `#${pokemon.id.toString().padStart(4, '0')}` : "????"}
							</motion.span>
							<div className="flex flex-col items-end text-xs opacity-80 mt-1">
								<span>Score: {score}</span>
								<span>Attempts: {attempts}</span>
							</div>
						</div>
					</div>

					{/* Pokémon Image inside the colored banner */}
					{pokemon ? (
						<div className="relative z-20 flex justify-center flex-1 w-full mt-2 mb-2 min-h-0">
							<PokemonView pokemon={pokemon} show={showPokemon} />
							{hint && (
								<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 z-30">
									{hint}
								</div>
							)}
						</div>
					) : (
						<div className="flex-1 w-full relative z-20 mt-2 mb-2 flex items-center justify-center min-h-0">
							<div className="animate-pulse w-32 h-32 sm:w-48 sm:h-48 bg-white/20 rounded-full" />
						</div>
					)}
				</motion.div>

				{/* Scrolling Content (White Card) */}
				<div className="relative z-10 flex flex-col flex-none w-full pb-4">
					
					{/* Bottom Card (Inputs, Controls) */}
					<div className="relative z-10 bg-background pt-4 px-4">
						<div className="max-w-xl mx-auto space-y-6">
							
							{/* Guess Input Area */}
							<div className="relative flex items-center w-full">
								<Input
									ref={inputRef}
									placeholder="Who's that Pokémon?"
									value={guess}
									onChange={(e) => setGuess(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && checkGuess()}
									className="w-full h-16 pl-6 pr-32 text-lg rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-primary/50"
									disabled={showAnswerState || !pokemon}
								/>
								<Button 
									onClick={checkGuess} 
									disabled={showAnswerState || guess.trim() === "" || !pokemon}
									className="absolute right-2 top-2 bottom-2 h-auto rounded-xl px-8 font-bold"
								>
									Guess
								</Button>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-2 justify-center">
								<Button
									variant="secondary"
									onClick={showHint}
									className="rounded-xl h-10 px-5 text-sm bg-muted/50 hover:bg-muted text-foreground"
									disabled={showAnswerState || !pokemon}
								>
									<Lightbulb className="mr-2 h-4 w-4 text-amber-500" /> Hint
								</Button>
								<Button
									variant="secondary"
									onClick={showAnswer}
									className="rounded-xl h-10 px-5 text-sm bg-muted/50 hover:bg-muted text-foreground"
									disabled={showAnswerState || !pokemon}
								>
									<Eye className="mr-2 h-4 w-4" /> Reveal Answer
								</Button>
								<Button
									variant="ghost"
									onClick={() => generateRandomPokemon()}
									className="rounded-xl h-10 px-5 text-sm text-muted-foreground hover:text-foreground"
								>
									Skip <SkipForward className="ml-2 h-4 w-4" />
								</Button>
							</div>

							<div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-3 justify-center items-center">
								<span className="text-sm font-medium text-muted-foreground">Generation:</span>
								<GenSelector selectedGens={selectedGens} setSelectedGens={setSelectedGens} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* RIGHT COLUMN (History Sidebar) */}
			<div className="w-full lg:w-1/3 bg-background flex flex-col border-t lg:border-t-0 border-border/50 lg:h-full">
				<div className="p-6 border-b border-border/50 flex justify-between items-center bg-background/80 backdrop-blur-md z-10 sticky top-0">
					<h3 className="text-lg font-bold">Recent Guesses</h3>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
								<RefreshCw className="mr-2 h-4 w-4" /> Reset
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently reset your score and clear your guess history.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={resetGame} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
									Reset Score
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				
				<div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar max-h-[400px] lg:max-h-none">
					{isLoaded && groupedHistory.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70">
							<p>No guesses yet.</p>
							<p className="text-sm">Start playing to see history!</p>
						</div>
					)}
					{isLoaded && groupedHistory.map((group) => {
						const isCurrentRound = group.pokemonId === pokemon?.id && !showAnswerState;
						const displayName = isCurrentRound ? `Mystery Pokémon #${group.pokemonId}` : group.pokemonName;
						const groupState = group.attempts.some(a => a.isCorrect) ? 'solved' : group.attempts.some(a => a.guessedName === "[Revealed Answer]") ? 'revealed' : 'active';
						const headerBg = groupState === 'solved' ? 'bg-green-50/50 dark:bg-green-900/20' : groupState === 'revealed' ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-muted/10';
						
						return (
							<div key={group.pokemonId} className="bg-background rounded-2xl border border-border/50 overflow-hidden">
								<div className={`px-4 py-3 border-b flex justify-between items-center ${headerBg}`}>
									<div className="flex items-center gap-3">
										<div className="relative w-10 h-10">
											<PokemonImage
												pokemonId={group.pokemonId}
												alt={displayName}
												imageSize={40}
												className={`object-contain transition-all duration-300 ${!group.isSolved ? "brightness-0 opacity-50" : ""}`}
											/>
										</div>
										<span className="font-bold text-sm capitalize">{displayName}</span>
									</div>
									{groupState === 'solved' && <CheckCircle className="w-4 h-4 text-green-500" />}
									{groupState === 'revealed' && <Eye className="w-4 h-4 text-blue-500" />}
								</div>
								<div className="p-3">
									<div className="text-xs flex flex-col gap-1.5">
										{(() => {
											const wrongAttempts = group.attempts.filter(a => !a.isCorrect && a.guessedName !== "[Revealed Answer]");
											const isRevealed = group.attempts.some(a => a.guessedName === "[Revealed Answer]");
											const isCorrect = group.attempts.some(a => a.isCorrect);
											
											return (
												<>
													{wrongAttempts.length > 0 && (
														<div className="text-muted-foreground">
															<span className="font-semibold text-red-400">Wrong:</span>{" "}
															{wrongAttempts.map(a => a.guessedName).join(', ')}
														</div>
													)}
													{isRevealed && (
														<div className="text-blue-500 font-semibold flex items-center gap-1">
															<Eye className="w-3 h-3" /> Answer Revealed
														</div>
													)}
													{isCorrect && (
														<div className="text-green-500 font-semibold flex items-center gap-1">
															<CheckCircle className="w-3 h-3" /> Correct in {group.attempts.length} {group.attempts.length === 1 ? 'try' : 'tries'}!
														</div>
													)}
												</>
											);
										})()}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
