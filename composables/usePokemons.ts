interface Pokemon {
  name: string
  url: string
}

interface PokeAPIResponse {
  count: number
  next?: number
  previous?: number
  results: Pokemon[]
}

interface PokemonResponse extends Pokemon {
  image: string
  types: string[]
}

interface TypeInfo {
  slot: number
  type: {
    name: string
    url: string
  }
}

export const usePokemons = () => {
  const fetchPokemons = async (generation: number): Promise<PokemonResponse[]> => {
    const { getLimitAndOffsets } = useGenerations();
    const { limit, offset } = getLimitAndOffsets(generation);
  
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemons: ${response.statusText}`);
    }
    const data: PokeAPIResponse = await response.json();
  
    const pokemonDetailsPromises = data.results.map(async (pokemonData) => {
      const detailsResponse = await fetch(pokemonData.url);
      if (!detailsResponse.ok) {
        throw new Error(`Failed to fetch details for ${pokemonData.name}`);
      }
      const details = await detailsResponse.json();
      const pokemonTypes = details.types.map((typeInfo: TypeInfo) => typeInfo.type.name);
      return {
        name: pokemonData.name,
        url: pokemonData.url,
        image: details.sprites.front_default,
        types: pokemonTypes,
      };
    });
  
    const resolvedPokemons: PokemonResponse[] = await Promise.all(pokemonDetailsPromises);
    return resolvedPokemons;
  };  

  const fetchPokemonDetails = async (id: number | string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon`);
    }
    const data = await response.json();
    return data;
  };

  const fetchPokemonEvolutions = async (id: number) => {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    if (!speciesResponse.ok) {
      throw new Error(`Failed to fetch Pokemon species`);
    }
    const pokemonSpecies = await speciesResponse.json();

    const evolutionsResponse = await fetch(pokemonSpecies.evolution_chain.url);
    if (!evolutionsResponse.ok) {
      throw new Error(`Failed to fetch Pokemon evolutions`);
    }
    const pokemonEvolutions = await evolutionsResponse.json();
    return pokemonEvolutions;
  };

  return {
    fetchPokemons,
    fetchPokemonDetails,
    fetchPokemonEvolutions,
  };
};
