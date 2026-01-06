"use client";

import { useEffect, useRef, useState } from "react";
import { GENERATION_LIMITS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

type Props = {
	selectedGens: number[];
	setSelectedGens: (gens: number[] | ((prev: number[]) => number[])) => void;
};

const LOCAL_STORAGE_KEY = "selectedGens";

export default function GenSelector({ selectedGens, setSelectedGens }: Props) {
	const [open, setOpen] = useState(false);
	const isFirstLoad = useRef(true);

	const allGenerations = Object.keys(GENERATION_LIMITS).map(Number);

	// On mount, load from localStorage if available
	useEffect(() => {
		const stored = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.every((g) => typeof g === "number")) {
					setSelectedGens(parsed);
				}
			} catch {}
		}
		// eslint-disable-next-line
	}, []);

	// Save to localStorage whenever selectedGens changes (but not on first load if it came from storage)
	useEffect(() => {
		if (isFirstLoad.current) {
			isFirstLoad.current = false;
			return;
		}
		if (typeof window !== "undefined") {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedGens));
		}
	}, [selectedGens]);

	const toggleGen = (gen: number) => {
		setSelectedGens((prev: number[]) =>
			prev.includes(gen)
				? prev.filter((g) => g !== gen)
				: [...prev, gen].sort((a, b) => a - b)
		);
	};

	const isAllSelected = allGenerations.every((gen) =>
		selectedGens.includes(gen)
	);

	const displayText = isAllSelected
		? "All"
		: selectedGens.length
		? selectedGens.join(" | ")
		: "None";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="min-w-[160px] justify-between"
				>
					Generations (
					<span className="mx-1 font-mono">
						{displayText}
					</span>
					)
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0 w-40">
				<ul className="py-1">
					{allGenerations.map((genNum) => {
						const selected = selectedGens.includes(genNum);
						return (
							<li
								key={genNum}
								role="option"
								aria-selected={selected}
								className={`flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-muted transition-colors select-none ${selected ? "font-bold bg-muted" : ""}`}
								tabIndex={0}
								onClick={() => toggleGen(genNum)}
								onKeyDown={e => {
									if (e.key === " " || e.key === "Enter") {
										e.preventDefault();
										toggleGen(genNum);
									}
								}}
							>
								<Checkbox
									checked={selected}
									onCheckedChange={() => toggleGen(genNum)}
									className="mr-2"
									aria-label={`Toggle Gen ${genNum}`}
									tabIndex={-1}
								/>
								<span>Gen {genNum}</span>
							</li>
						);
					})}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
