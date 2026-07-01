"use client";

import { useQueryState } from "nuqs";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useRef, useEffect } from "react";
import PokemonCard from "@/app/pokemons/[gen]/_components/pokemon-card";
import { Pokemon } from "../actions";
import { useDetailsMobileView } from "../../details-mobile-view-provider";
import { playPokemonCry } from "@/lib/utils";

export default function PokemonListingClient({
  gen,
  pokemons,
  allPokemons,
}: {
  gen: number;
  pokemons: Pokemon[];
  allPokemons?: { id: number; name: string; types: string[]; gen: number }[];
}) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const router = useRouter();
  const { setIsOpen } = useDetailsMobileView();
  const pathname = usePathname();
  const currentActivePokemonId = pathname.split('/').pop();
  const lastClickedId = useRef<number | null>(null);

  const filteredPokemons = useMemo(() => {
    if (!search || !allPokemons) {
      // If no search term, or no allPokemons provided, just filter the current gen (or show all if no search)
      return pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()) || 
        pokemon.id.toString().includes(search.toLowerCase())
      );
    }
    
    const s = search.toLowerCase();
    
    // Global fuzzy search across all generations by name or id
    const matches = allPokemons.filter((p) => 
      p.name.toLowerCase().includes(s) || 
      p.id.toString().includes(s)
    );
    
    return matches.map((match) => {
      const existing = pokemons.find((p) => p.id === match.id);
      if (existing) return { ...existing, gen: match.gen };
      
      // Fallback for pokemons from other generations
      return {
        id: match.id,
        name: match.name,
        url: "",
        types: match.types,
        gen: match.gen
      } as Pokemon;
    });
  }, [pokemons, allPokemons, search]);

  const handlePokemonClick = (pokemonId: number, pokemonGen?: number) => {
    if (lastClickedId.current === pokemonId) return;
    lastClickedId.current = pokemonId;
    playPokemonCry(pokemonId);
    
    const targetGen = pokemonGen || gen;
    router.push(`/pokemons/${targetGen}/${pokemonId}`);
    
    setTimeout(() => setIsOpen(true), 300);
  };

  useEffect(() => {
    if (currentActivePokemonId) {
      setTimeout(() => {
        const element = document.getElementById(`pokemon-${currentActivePokemonId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [currentActivePokemonId]);

  return (
    <ul className="space-y-1">
      {filteredPokemons.map((pokemon) => (
        <li key={pokemon.name} id={`pokemon-${pokemon.id}`}>
          <PokemonCard
            pokemon={pokemon}
            onClick={(id) => handlePokemonClick(id, pokemon.gen)}
            activePokemon={currentActivePokemonId!}
            currentGen={gen}
          />
        </li>
      ))}
    </ul>
  );
}
