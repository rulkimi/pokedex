"use client";

import { useQueryState } from "nuqs";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useRef, useEffect } from "react";
import PokemonCard from "@/components/pokemon-card";
import { Pokemon } from "../actions";

export default function PokemonListingClient({
  gen,
  pokemons,
}: {
  gen: number;
  pokemons: Pokemon[];
}) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const router = useRouter();
  const pathname = usePathname();
  const currentActivePokemonId = pathname.split('/').pop();
  const lastClickedId = useRef<number | null>(null);

  const filteredPokemons = useMemo(
    () =>
      pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      ),
    [pokemons, search]
  );

  const handlePokemonClick = (pokemonId: number) => {
    if (lastClickedId.current === pokemonId) return;
    lastClickedId.current = pokemonId;
    router.push(`/pokemons/${gen}/${pokemonId}`);
  };

  useEffect(() => {
    if (currentActivePokemonId) {
      const element = document.getElementById(`pokemon-${currentActivePokemonId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentActivePokemonId]);

  return (
    <ul className="space-y-1">
      {filteredPokemons.map((pokemon) => (
        <li key={pokemon.name} id={`pokemon-${pokemon.id}`}>
          <PokemonCard
            pokemon={pokemon}
            onClick={handlePokemonClick}
            activePokemon={currentActivePokemonId!}
          />
        </li>
      ))}
    </ul>
  );
}
