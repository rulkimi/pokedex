"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getFirstPokemonId } from "@/lib/utils";

export default function GenSelect() {
	const [selectedGen, setSelectedGen] = useState<number>(1);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const gen = Number(pathname.split('/').at(-2));
		if (!isNaN(gen)) {
			setSelectedGen(gen);
		}
	}, [pathname]);

	const handleChange = (value: string) => {
		const gen = Number(value);
		const firstPokemonId = getFirstPokemonId(gen);
		router.push(`/pokemons/${gen}/${firstPokemonId}`);
		setSelectedGen(gen);
	};

	return (
		<Select
      value={selectedGen.toString()}
      onValueChange={handleChange}
    >
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select gen" />
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: 9 }, (_, i) => i + 1).map((gen) => (
					<SelectItem key={gen} value={gen.toString()}>
						Gen {gen}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
