"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
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
  const [types] = useQueryState("types", parseAsArrayOf(parseAsString).withDefault([]));
  const router = useRouter();
  const { setIsOpen } = useDetailsMobileView();
  const pathname = usePathname();
  const currentActivePokemonId = pathname.split('/').pop();
  const lastClickedId = useRef<number | null>(null);

  const filteredPokemons = useMemo(() => {
    let sourceList = allPokemons && (search || types.length > 0) ? allPokemons : pokemons;
    
    // Filter by search string
    let result = sourceList;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(s) || 
        p.id.toString().includes(s)
      );
    }

    // Filter by types
    if (types.length > 0) {
      result = result.filter((p) => types.every((t) => p.types.includes(t)));
    }

    // Map to full Pokemon objects if searching globally
    if (sourceList === allPokemons) {
      return result.map((match) => {
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
    }

    return result as Pokemon[];
  }, [pokemons, allPokemons, search, types]);

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
    let emptyTitle = "No Pokémon found";
    let emptySubtitle = "Try searching for a different name or ID.";

    if (types.length === 1) {
      emptyTitle = `No ${types[0]} Pokémon found`;
      emptySubtitle = search ? "Try adjusting your search term or filter." : "Try selecting a different type.";
    } else if (types.length > 1) {
      emptyTitle = "No Pokémon match these types";
      emptySubtitle = "Try removing some type filters to see more results.";
    } else if (search) {
      emptySubtitle = "Try searching for a different name or ID.";
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-70 text-center">
        <div className="relative mb-4">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="w-16 h-16 opacity-30 text-muted-foreground rotate-12">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="12" />
            <path d="M10 50 H38" />
            <path d="M62 50 H90" />
          </svg>
        </div>
        <p className="text-lg font-medium capitalize">{emptyTitle}</p>
        <p className="text-sm">{emptySubtitle}</p>
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
