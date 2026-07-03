"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPokemonById } from "../../[gen]/actions";
import { playPokemonCry, getGeneration, getPokemonGen, getArrangedTypes, getTypeColor, getPokemonImageUrl } from "@/lib/utils";
import PokemonView from "./pokemon-view";
import GenSelector from "./gen-selector";
import { PokemonDetail } from "../../[gen]/actions";
import { Lightbulb, RefreshCw, Eye, SkipForward, CheckCircle, XCircle, Info } from "lucide-react";
import { motion } from "motion/react";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import Link from "next/link";
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
import { toPng } from "html-to-image";
import { Share2, ImageIcon, LinkIcon, Loader2, Check, History, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";
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
	const [showHistory, setShowHistory] = useState(false);
	const attemptsRef = useRef(0);
	const [isLoaded, setIsLoaded] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const searchParams = useSearchParams();
	const p = searchParams?.get("p");
	const router = useRouter();
	const [navigatingId, setNavigatingId] = useState<number | null>(null);
	
	const [shareData, setShareData] = useState<{pokemonId: number, message?: string} | null>(null);
	const [isGeneratingShare, setIsGeneratingShare] = useState(false);
	const [copiedLink, setCopiedLink] = useState(false);
	const shareCardRef = useRef<HTMLDivElement>(null);

	const handleGoToPokedex = (pokemonId: number) => {
		setNavigatingId(pokemonId);
		router.push(`/pokemons/${getPokemonGen(pokemonId)}/${pokemonId}`);
	};

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

		if (p) {
			try {
				const decodedId = parseInt(atob(p));
				if (!isNaN(decodedId)) {
					fetchPokemonById(decodedId).then(poke => {
						if (poke) {
							setPokemon(poke);
							setGuess("");
							setAttempts(0);
							attemptsRef.current = 0;
							setShowPokemon(false);
							setHint("");
							setMessage(null);
							setShowAnswerState(false);
							setIsLoaded(true);
						} else {
							generateRandomPokemon(initialGens);
						}
					});
					return;
				}
			} catch(e) {}
		}

		generateRandomPokemon(initialGens);
		setIsLoaded(true);
	}, [p]);

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
			<div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
				<div
					className={`flex items-center gap-3 border rounded-lg px-4 py-3 transition-all animate-in fade-in slide-in-from-top-4 zoom-in-95 duration-300 pointer-events-auto bg-background/95 backdrop-blur shadow-md ${color}`}
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

	const handleShareImage = async () => {
		if (!shareCardRef.current || !shareData) return;
		try {
			setIsGeneratingShare(true);
			const isDark = document.documentElement.classList.contains('dark');
			
			// iOS Safari workaround: Render once to cache assets, then render again
			await toPng(shareCardRef.current, { cacheBust: false, pixelRatio: 1 });
			
			const dataUrl = await toPng(shareCardRef.current, { 
				quality: 1,
				pixelRatio: 2,
				backgroundColor: isDark ? '#0f172a' : '#ffffff',
				style: { transform: 'none', borderRadius: '0' }
			});
			
			const res = await fetch(dataUrl);
			const blob = await res.blob();
			const file = new File([blob], `guess-pokemon-${shareData.pokemonId}.png`, { type: 'image/png' });

			let shared = false;
			if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({
						files: [file]
					});
					shared = true;
				} catch (e: any) {
					if (e.name === 'AbortError') {
						shared = true;
					}
				}
			}
			
			if (!shared) {
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.download = `guess-pokemon-${shareData.pokemonId}.png`;
				link.href = url;
				link.click();
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			console.error("Failed to generate image", err);
		} finally {
			setIsGeneratingShare(false);
		}
	};

	const handleShareLink = async () => {
		if (!shareData) return;
		try {
			const encodedId = btoa(shareData.pokemonId.toString());
			const shareUrl = `${window.location.origin}/pokemons/guess?p=${encodedId}`;
			
			const shareText = shareData.message || "Can you guess this Pokémon? Play with me!";
			
			await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2000);
		} catch {}
	};

	const openShareModal = (pokemonId: number, isCurrent: boolean) => {
		const attemptsForPokemon = history.filter(item => item.pokemonId === pokemonId);
		const wrongAttempts = attemptsForPokemon.filter(a => !a.isCorrect && a.guessedName !== "[Revealed Answer]");
		const isRevealed = attemptsForPokemon.some(a => a.guessedName === "[Revealed Answer]");
		const isCorrect = attemptsForPokemon.some(a => a.isCorrect);

		let msg = "";
		if (isCurrent && !showAnswerState) {
			if (attemptsForPokemon.length === 0) {
				msg = `Can you guess this Mystery Pokémon?`;
			} else {
				msg = `I'm still trying to guess a Mystery Pokémon! So far I have ${wrongAttempts.length} wrong attempts.`;
			}
		} else {
			if (isCorrect) {
				msg = `I guessed the Mystery Pokémon correctly in ${attemptsForPokemon.length} attempts!`;
			} else if (isRevealed) {
				msg = `I couldn't guess the Mystery Pokémon. I gave up after ${wrongAttempts.length} wrong attempts and revealed the answer!`;
			} else {
				msg = `I'm still trying to guess a Mystery Pokémon! So far I have ${wrongAttempts.length} wrong attempts.`;
			}
		}

		setShareData({
			pokemonId,
			message: isCurrent && !showAnswerState && attemptsForPokemon.length === 0 
				? `${msg} Play with me:`
				: `${msg}\n\nCan you do better? Play here:`
		});
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
		<>
		<div className="relative w-full max-w-4xl mx-auto min-h-[calc(100dvh-190px)] rounded-3xl border border-border/50 overflow-hidden shadow-none bg-background flex flex-col">
			
			{/* Top Banner (Color + Background Elements + Pokemon) */}
			<motion.div 
				className={`relative z-0 p-6 sm:p-8 flex flex-col items-center justify-center transition-colors duration-700 ease-in-out min-h-[320px] ${getBannerColor()}`}
			>
				{renderMessage()}
				<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="absolute -right-8 top-4 w-64 h-64 opacity-[0.15] text-white rotate-12 pointer-events-none">
					<circle cx="50" cy="50" r="40" />
					<circle cx="50" cy="50" r="12" />
					<path d="M10 50 H38" />
					<path d="M62 50 H90" />
				</svg>

				<div className="w-full flex justify-between items-start z-10 text-white/90 mb-4">
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
					<div className="relative z-20 flex justify-center w-full mt-2 mb-2 h-[220px] sm:h-[260px] shrink-0">
						<PokemonView pokemon={pokemon} show={showPokemon} />
						{hint && (
							<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 z-30 whitespace-nowrap">
								{hint}
							</div>
						)}
					</div>
				) : (
					<div className="w-full relative z-20 mt-2 mb-2 flex items-center justify-center h-[220px] sm:h-[260px] shrink-0">
						<div className="animate-pulse w-32 h-32 sm:w-48 sm:h-48 bg-white/20 rounded-full" />
					</div>
				)}
			</motion.div>

			{/* Bottom Area (Form + Inline History) */}
			<div className="flex-1 bg-background flex flex-col p-6 sm:p-8">
				
				{!showHistory ? (
					<div className="max-w-xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
						{/* Guess Input Area */}
						<div className="relative flex items-center w-full">
							<Input
								ref={inputRef}
								placeholder="Who's that Pokémon?"
								value={guess}
								onChange={(e) => setGuess(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && checkGuess()}
								className="w-full h-14 pl-6 pr-32 text-lg rounded-2xl bg-muted/20 border-border/50 focus-visible:ring-primary/50"
								disabled={showAnswerState || !pokemon}
							/>
							<Button 
								onClick={checkGuess} 
								disabled={showAnswerState || guess.trim() === "" || !pokemon}
								className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-xl px-6 font-bold"
							>
								Guess
							</Button>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-2 justify-center">
							<Button
								variant="secondary"
								onClick={showHint}
								className="rounded-xl px-4 text-sm bg-muted/50 hover:bg-muted"
								disabled={showAnswerState || !pokemon}
							>
								<Lightbulb className="mr-2 h-4 w-4 text-amber-500" /> Hint
							</Button>
							<Button
								variant="secondary"
								onClick={showAnswer}
								className="rounded-xl px-4 text-sm bg-muted/50 hover:bg-muted"
								disabled={showAnswerState || !pokemon}
							>
								<Eye className="mr-2 h-4 w-4" /> Reveal
							</Button>
							<Button 
								variant="outline" 
								onClick={() => pokemon && openShareModal(pokemon.id, true)}
								className="rounded-xl px-4 text-sm text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/50 dark:hover:bg-blue-900/20"
							>
								<Share2 className="mr-2 h-4 w-4" /> Share
							</Button>
							<Button
								variant="secondary"
								onClick={() => setShowHistory(true)}
								className="rounded-xl px-4 text-sm bg-muted/50 hover:bg-muted"
							>
								<History className="mr-2 h-4 w-4" /> History
							</Button>
							<Button
								variant="ghost"
								onClick={() => generateRandomPokemon()}
								className="rounded-xl px-4 text-sm text-muted-foreground hover:text-foreground"
							>
								Skip <SkipForward className="ml-2 h-4 w-4" />
							</Button>
						</div>

						<div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Generation</span>
							<GenSelector selectedGens={selectedGens} setSelectedGens={setSelectedGens} />
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
						<div className="flex justify-between items-center mb-6">
							<div className="flex items-center gap-3">
								<Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="rounded-full">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
								</Button>
								<h3 className="text-xl font-bold flex items-center gap-2">
									Recent Guesses
									{groupedHistory.length > 0 && (
										<span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
											{groupedHistory.length}
										</span>
									)}
								</h3>
							</div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
										<RefreshCw className="mr-2 h-4 w-4" /> Reset Score
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
										<AlertDialogAction onClick={() => { resetGame(); setShowHistory(false); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
											Reset Score
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						<div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[300px]">
							{isLoaded && groupedHistory.length === 0 && (
								<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70 py-10">
									<p>No guesses yet.</p>
									<p className="text-sm">Start playing to see your history!</p>
								</div>
							)}
							{isLoaded && groupedHistory.map((group) => {
								const isCurrentRound = group.pokemonId === pokemon?.id && !showAnswerState;
								const displayName = isCurrentRound ? `Mystery Pokémon #${group.pokemonId}` : group.pokemonName;
								const groupState = group.attempts.some(a => a.isCorrect) ? 'solved' : group.attempts.some(a => a.guessedName === "[Revealed Answer]") ? 'revealed' : 'active';
								const headerBg = groupState === 'solved' ? 'bg-green-50/50 dark:bg-green-900/20' : groupState === 'revealed' ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-muted/30';
								
								return (
									<div key={group.pokemonId} className={`rounded-xl border border-border/50 overflow-hidden ${headerBg}`}>
										<div className="px-4 py-3 flex justify-between items-center transition-all">
											<div className="flex items-center gap-3">
												<div className="relative w-10 h-10">
													<PokemonImage
														pokemonId={group.pokemonId}
														alt={displayName}
														className={`w-full h-full object-contain ${!group.isSolved && !isCurrentRound ? 'brightness-0' : ''}`}
													/>
												</div>
												<div>
													<h4 className="font-bold capitalize">{displayName}</h4>
													<div className="text-xs text-muted-foreground">
														{group.attempts.length} {group.attempts.length === 1 ? 'attempt' : 'attempts'}
													</div>
												</div>
											</div>
											<div className="text-right flex items-center">
												<div className="text-sm mr-2 hidden sm:block">
													{(() => {
														const isCorrect = group.attempts.some(a => a.isCorrect);
														const isRevealed = group.attempts.some(a => a.guessedName === "[Revealed Answer]");
														return (
															<>
																{!isCorrect && !isRevealed && (
																	<span className="text-muted-foreground font-medium">Playing...</span>
																)}
																{isRevealed && (
																	<div className="text-blue-500 font-semibold flex items-center gap-1">
																		<Eye className="w-4 h-4" /> Revealed
																	</div>
																)}
																{isCorrect && (
																	<div className="text-green-500 font-semibold flex items-center gap-1">
																		<CheckCircle className="w-4 h-4" /> Correct
																	</div>
																)}
															</>
														);
													})()}
												</div>
												<Button 
													variant="ghost" 
													size="icon" 
													className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 ml-1 rounded-full hover:bg-background/50"
													onClick={(e) => {
														e.preventDefault();
														openShareModal(group.pokemonId, false);
													}}
													title="Share this result"
												>
													<Share2 className="h-4 w-4" />
												</Button>
												<Button 
													variant="ghost" 
													size="icon" 
													className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 ml-1 rounded-full hover:bg-background/50"
													onClick={(e) => {
														e.preventDefault();
														handleGoToPokedex(group.pokemonId);
													}}
													disabled={navigatingId === group.pokemonId}
													title="View in Pokédex"
												>
													{navigatingId === group.pokemonId ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
												</Button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>

			<Dialog open={!!shareData} onOpenChange={(open) => !open && setShareData(null)}>
				<DialogContent className="sm:max-w-3xl bg-transparent border-none shadow-none overflow-visible p-0 flex flex-col items-center justify-center gap-6 outline-none">
					<DialogHeader className="sr-only">
						<DialogTitle>Share Guess</DialogTitle>
					</DialogHeader>
					
					<div className="flex justify-center w-full relative z-10 h-[210px] sm:h-[300px] md:h-[420px]">
						<div className="origin-top shrink-0 scale-[0.35] sm:scale-[0.5] md:scale-[0.7]" style={{ width: '1050px', height: '600px' }}>
							<div 
								ref={shareCardRef} 
								className={`w-[1050px] h-[600px] overflow-hidden rounded-[3rem] shadow-2xl flex relative z-10 border-none bg-background ${isDark ? 'dark' : ''}`}
							>
								<div className={`w-[460px] relative p-12 flex flex-col justify-center shrink-0 ${getBannerColor()}`}>
									<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="absolute -right-16 top-10 w-[120%] h-[120%] opacity-[0.12] text-white rotate-12 pointer-events-none">
										<circle cx="50" cy="50" r="40" />
										<circle cx="50" cy="50" r="12" />
										<path d="M10 50 H38" />
										<path d="M62 50 H90" />
									</svg>
									<div className="relative z-10">
										<h3 className="font-extrabold text-[4.5rem] leading-[1.1] text-white tracking-tight drop-shadow-md mb-4">Who's That Pokémon?</h3>
										<p className="text-white/80 text-2xl font-bold tracking-widest uppercase mb-12">
											Pokédex by rulkimi
										</p>
										<div className="bg-white/25 border border-white/40 px-6 py-3 rounded-full inline-flex items-center justify-center shadow-sm">
											<span className="text-white text-2xl font-black tracking-widest uppercase">Can you guess it?</span>
										</div>
									</div>
								</div>
								
								{/* Right Panel - Silhouette */}
								<div className="flex-1 bg-background p-10 flex flex-col items-center justify-center relative overflow-hidden z-10">
									<div className="relative w-full h-full flex items-center justify-center">
										{shareData && (
											<img 
												src={getPokemonImageUrl(shareData.pokemonId)} 
												alt="Mystery Pokémon" 
												crossOrigin="anonymous"
												className="w-[400px] h-[400px] object-contain brightness-0 opacity-80 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]" 
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="flex gap-4 w-full max-w-sm px-4">
						<Button onClick={handleShareImage} disabled={isGeneratingShare} className="flex-1 rounded-full h-14 font-bold shadow-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white transition-all">
							{isGeneratingShare ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-2" />}
							{isGeneratingShare ? "Saving..." : "Save Image"}
						</Button>
						<Button onClick={handleShareLink} className="flex-1 rounded-full h-14 font-bold shadow-xl bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white transition-all">
							{copiedLink ? <Check className="w-5 h-5 mr-2 text-green-400" /> : <LinkIcon className="w-5 h-5 mr-2" />}
							{copiedLink ? "Copied!" : "Copy Link"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
