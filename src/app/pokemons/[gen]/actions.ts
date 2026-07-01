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
  item?: string;
  happiness?: number;
  time_of_day?: string;
  held_item?: string;
  location?: string;
  known_move?: string;
}

export interface PokemonDetail {
  id: number;
  speciesId: number;
  name: string;
  types: string[];
  stats: Stat[];
  evolutions: Evolution[];
  variants?: { id: number; name: string }[];
  height: number;
  weight: number;
  base_experience: number;
  abilities: { name: string; is_hidden: boolean }[];
  cries?: { latest: string; legacy: string };
  description?: string;
  egg_groups?: string[];
  habitat?: string;
  gender_rate?: number;
  moves: string[];
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

    let evolutions: Evolution[] = [];
    
    let description: string | undefined = undefined;
    let egg_groups: string[] | undefined = undefined;
    let habitat: string | undefined = undefined;
    let gender_rate: number | undefined = undefined;
    let variants: { id: number; name: string }[] = [];
    try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`, { cache: "force-cache" });
      if (speciesResponse.ok) {
        const speciesData = await speciesResponse.json();
        
        // description
        const enFlavor = speciesData.flavor_text_entries?.find((f: any) => f.language.name === "en");
        if (enFlavor) description = enFlavor.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');

        // egg groups
        if (speciesData.egg_groups) {
          egg_groups = speciesData.egg_groups.map((eg: any) => eg.name);
        }

        // habitat
        if (speciesData.habitat) {
          habitat = speciesData.habitat.name;
        }

        // gender
        gender_rate = speciesData.gender_rate;

        if (speciesData.varieties && speciesData.varieties.length > 1) {
          variants = speciesData.varieties.map((v: any) => {
            const parts = v.pokemon.url.split('/').filter(Boolean);
            return {
              id: parseInt(parts[parts.length - 1]),
              name: v.pokemon.name
            };
          });
        }

        if (speciesData.evolution_chain?.url) {
          try {
            const evChainRes = await fetch(speciesData.evolution_chain.url, { cache: "force-cache" });
            if (evChainRes.ok) {
              const evData = await evChainRes.json();
              
              const parseChain = (node: any): Evolution[] => {
                const parts = node.species.url.split('/').filter(Boolean);
                const pId = parseInt(parts[parts.length - 1]);
                
                let evolution: Evolution = { id: pId, name: node.species.name };
                
                if (node.evolution_details && node.evolution_details.length > 0) {
                  const details = node.evolution_details[0];
                  evolution.trigger = details.trigger?.name;
                  evolution.item = details.item?.name;
                  evolution.level = details.min_level;
                  evolution.happiness = details.min_happiness;
                  evolution.time_of_day = details.time_of_day;
                  evolution.held_item = details.held_item?.name;
                  evolution.location = details.location?.name;
                  evolution.known_move = details.known_move?.name;
                }
                
                let res = [evolution];
                if (node.evolves_to && node.evolves_to.length > 0) {
                  for (const child of node.evolves_to) {
                    res = res.concat(parseChain(child));
                  }
                }
                return res;
              };
              
              evolutions = parseChain(evData.chain);
            }
          } catch (e) {
            console.error("Failed to parse evolution chain:", e);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch species data for varieties", e);
    }

    return {
      id: pokemon.id,
      speciesId,
      name: pokemon.name,
      types: pokemon.types.map((t: any) => t.type.name),
      stats: pokemon.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      evolutions,
      variants,
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,
      abilities: pokemon.abilities?.map((a: any) => ({
        name: a.ability.name,
        is_hidden: a.is_hidden
      })) || [],
      cries: pokemon.cries,
      description,
      egg_groups,
      habitat,
      gender_rate,
      moves: pokemon.moves?.map((m: any) => m.move.name) || [],
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