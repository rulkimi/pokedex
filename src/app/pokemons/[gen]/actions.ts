"use server";

import { getGeneration, getPokemonImageUrl, type Stat } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

interface FetchPokemonProps {
  gen: number;
}

export interface Pokemon {
  id: number;
  name: string;
  // image: string;
  url: string;
  types: string[];
  gen?: number;
}

export interface Evolution {
  id: number;
  name: string;
  level?: number;
  trigger?: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  stats: Stat[];
  evolutions: Evolution[];
  variants?: { id: number; name: string }[];
}

const fetchPokemonTypes = async (url: string): Promise<{id: number, types: string[]}> => {
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pokemon = await response.json();
    
    return {
      id: pokemon.id,
      types: pokemon.types.map((t: any) => t.type.name)
    };
  } catch (error) {
    console.error(`Error fetching types from ${url}:`, error);
    return { id: 0, types: [] };
  }
};

export const fetchPokemonById = async (id: number): Promise<PokemonDetail | null> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { cache: "force-cache" });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Pokemon with id ${id} not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pokemon = await response.json();
    
    let speciesId = pokemon.id;
    if (pokemon.id > 10000 && pokemon.species?.url) {
      const parts = pokemon.species.url.split('/').filter(Boolean);
      speciesId = parseInt(parts[parts.length - 1]);
    }

    const filePath = path.join(process.cwd(), "public", "evolutions.json");
    let evolutions: Evolution[] = [];

    try {
      const file = await fs.readFile(filePath, "utf-8");
      const evolutionsData = JSON.parse(file);

      for (const chain of Object.values(evolutionsData) as Evolution[][]) {
        if (chain.some((e) => e.id == speciesId)) {
          evolutions = chain;
          break;
        }
      }

    } catch (e) {
      console.warn("Failed to read evolutions.json from disk:", e);
    }
    
    let variants: { id: number; name: string }[] = [];
    try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`, { cache: "force-cache" });
      if (speciesResponse.ok) {
        const speciesData = await speciesResponse.json();
        if (speciesData.varieties && speciesData.varieties.length > 1) {
          variants = speciesData.varieties.map((v: any) => {
            const parts = v.pokemon.url.split('/').filter(Boolean);
            return {
              id: parseInt(parts[parts.length - 1]),
              name: v.pokemon.name
            };
          });
        }
      }
    } catch (e) {
      console.warn("Failed to fetch species data for varieties", e);
    }

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t: any) => t.type.name),
      stats: pokemon.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      evolutions,
      variants,
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
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${generation.limit}&offset=${generation.offset}`,
      { cache: "force-cache" }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const basePokemons = data.results;
    
    // Fetch detailed info for each Pokemon
    const pokemonsWithTypes = await Promise.all(
      basePokemons.map(async (pokemon: any) => {
        const { id, types } = await fetchPokemonTypes(pokemon.url);
        
        return {
          id,
          name: pokemon.name,
          url: pokemon.url,
          types,
        };
      })
    );
    
    return pokemonsWithTypes as Pokemon[];
  } catch (error) {
    console.error("Error fetching pokemons:", error);
    return [];
  }
};