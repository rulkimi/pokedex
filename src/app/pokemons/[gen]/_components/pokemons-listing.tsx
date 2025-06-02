"use client"

import PokemonCard from "@/components/pokemon-card";
import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { fetchPokemons, Pokemon } from "../actions";

export default function PokemonsListing({ gen }: { gen: number }) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons({ gen }).then(setPokemons);
  }, [gen]);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ul className="space-y-1">
      {filteredPokemons.map((pokemon) => (
        <li key={pokemon.name}>
          <PokemonCard pokemon={pokemon} />
        </li>
      ))}
    </ul>
  );
}
