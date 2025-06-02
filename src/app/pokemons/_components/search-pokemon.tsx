"use client"

import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

export default function SearchPokemon() {
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
		shallow: true
	});

	return (
		<Input 
			placeholder="Search pokémon..." 
			value={search}
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}