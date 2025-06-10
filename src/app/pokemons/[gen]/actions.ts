"use server";
import { getGeneration, getPokemonImageUrl, type Stat } from "@/lib/utils";

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

const fetchPokemonTypes = async (url: string): Promise<{id: number, types: string[]}> => {
  try {
    const response = await fetch(url);
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
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Pokemon with id ${id} not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const pokemon = await response.json();
    
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
    // First, get the list of Pokemon for this generation
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${generation.limit}&offset=${generation.offset}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const basePokemons = data.results;
    
    // Fetch detailed info for each Pokemon
    const pokemonsWithTypes = await Promise.all(
      basePokemons.map(async (pokemon: any, index: number) => {
        const { id, types } = await fetchPokemonTypes(pokemon.url);
        
        return {
          id,
          name: pokemon.name,
          image: getPokemonImageUrl(id),
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