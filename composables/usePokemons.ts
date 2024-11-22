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

export const usePokemons = () => {

  const fetchPokemons = async (generation: number): Promise<PokeAPIResponse> => {
    
    const { getLimitAndOffsets } = useGenerations();
    const { limit, offset } = getLimitAndOffsets(generation);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemons: ${response.statusText}`);
    }
    const data: PokeAPIResponse = await response.json();
    return data;
  };

  const fetchPokemonDetails = async (id: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon`);
    }
    const data = await response.json();
    return data;
  }

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
  }

  return { 
    fetchPokemons, 
    fetchPokemonDetails,
    fetchPokemonEvolutions,
  };
};