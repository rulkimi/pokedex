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

	const allGenerations = Object.keys(GENERATION_LIMITS).map(Number);

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
									className="mr-2 pointer-events-none"
									aria-label={`Toggle Gen ${genNum}`}
									tabIndex={-1}
								/>
								<span>{genNum === 10 ? "Variants" : `Gen ${genNum}`}</span>
							</li>
						);
					})}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
