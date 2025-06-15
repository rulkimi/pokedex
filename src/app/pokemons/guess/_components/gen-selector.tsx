"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GENERATION_LIMITS } from "@/lib/utils";

type Props = {
  selectedGens: number[];
  setSelectedGens: (gens: number[] | ((prev: number[]) => number[])) => void;
};

export default function GenSelector({ selectedGens, setSelectedGens }: Props) {
  const toggleGen = (gen: number) => {
    setSelectedGens((prev: number[]) =>
      prev.includes(gen)
        ? prev.filter((g) => g !== gen)
        : [...prev, gen].sort((a, b) => a - b)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Generations ({selectedGens.join(" | ")})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(GENERATION_LIMITS).map((gen) => {
          const genNum = Number(gen);
          return (
            <DropdownMenuCheckboxItem
              key={gen}
              checked={selectedGens.includes(genNum)}
              onCheckedChange={() => toggleGen(genNum)}
            >
              Gen {gen}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
