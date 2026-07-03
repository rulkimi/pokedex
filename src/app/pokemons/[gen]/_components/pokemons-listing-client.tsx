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

  if (filteredPokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-70">
        <div className="relative mb-4">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="w-16 h-16 opacity-30 text-muted-foreground rotate-12">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="12" />
            <path d="M10 50 H38" />
            <path d="M62 50 H90" />
          </svg>
        </div>
        <p className="text-lg font-medium">No Pokémon found</p>
        <p className="text-sm">Try searching for a different name or ID.</p>
      </div>
    );
  }

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
