"use server";

import { getGeneration } from "@/utils";

const gqlQuery = `query pokemons($limit: Int, $offset: Int) {
  pokemons(limit: $limit, offset: $offset) {
    results {
      id
      name
      image
      url
    }
  }
}`;

interface FetchPokemonProps {
  gen: number;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  url: string;
  types: string[];
}

const pokemonDetailQuery = `
  query getPokemon($name: String!) {
    pokemon(name: $name) {
      id
      types {
        type {
          name
        }
      }
    }
  }
`;

const fetchPokemonTypes = async (name: string): Promise<{id: number, types: string[]}> => {
  try {
    const response = await fetch("https://graphql-pokeapi.graphcdn.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: pokemonDetailQuery,
        variables: { name },
      }),
    });

    const json = await response.json();
    const types = json.data.pokemon.types;
    return {
      id: json.data.pokemon.id,
      types: types.map((t: any) => t.type.name)
    };
  } catch (error) {
    console.error(`Error fetching types for ${name}:`, error);
    return { id: 0, types: [] };
  }
};

export const fetchPokemons = async ({
  gen,
}: FetchPokemonProps): Promise<Pokemon[]> => {
  const generation = getGeneration(gen);

  try {
    const response = await fetch("https://graphql-pokeapi.graphcdn.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: gqlQuery,
        variables: generation,
      }),
    });

    const json = await response.json();
    const basePokemons = json.data.pokemons.results;

    const pokemonsWithTypes = await Promise.all(
      basePokemons.map(async (pokemon: any) => {
        const { id, types } = await fetchPokemonTypes(pokemon.name);
        return {
          ...pokemon,
          id,
          types,
        };
      })
    );

    return pokemonsWithTypes as Pokemon[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
