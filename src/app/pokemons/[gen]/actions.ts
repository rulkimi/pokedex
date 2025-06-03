"use server";

import { getGeneration, type Stat } from "@/utils";

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

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  stats: Stat[];
}

const pokemonTypesQuery = `
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

const pokemonDetailQuery = `
  query getPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      types {
        type {
          name
        }
      }
      stats {
        stat {
          name
        }
        base_stat
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
        query: pokemonTypesQuery,
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

export const fetchPokemonById = async (id: number): Promise<PokemonDetail | null> => {
  try {
    const response = await fetch("https://graphql-pokeapi.graphcdn.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: pokemonDetailQuery,
        variables: { name: id.toString() },
      }),
    });

    const json = await response.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      return null;
    }

    const pokemon = json.data.pokemon;
    if (!pokemon) {
      console.error('No pokemon data found');
      return null;
    }

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t: any) => t.type.name),
      stats: pokemon.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };
  } catch (error) {
    console.error(`Error fetching pokemon ${id}:`, error);
    return null;
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
