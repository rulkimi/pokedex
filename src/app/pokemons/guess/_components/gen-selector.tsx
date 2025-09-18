"use client";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GENERATION_LIMITS } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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

	const displayText = isAllSelected ? "All" : selectedGens.join(" | ");

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Generations ( {displayText} )</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				onCloseAutoFocus={e => {
					// Prevent closing on checkbox click
					e.preventDefault();
				}}
			>
				{Object.keys(GENERATION_LIMITS).map((gen) => {
					const genNum = Number(gen);
					return (
						<DropdownMenuCheckboxItem
							key={gen}
							checked={selectedGens.includes(genNum)}
							onCheckedChange={() => {
								toggleGen(genNum);
								// Don't close dropdown on check
							}}
							// Prevent dropdown from closing on click
							onSelect={e => e.preventDefault()}
						>
							Gen {gen}
						</DropdownMenuCheckboxItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
