export const usePokemons = () => {
  const fetchPokemons = async (generation: number): Promise<PokemonResponse[]> => {
    const cachedPokemons = localStorage.getItem(`pokemons-gen-${generation}`);
    if (cachedPokemons) {
      return JSON.parse(cachedPokemons);
    };

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
    localStorage.setItem(`pokemons-gen-${generation}`, JSON.stringify(resolvedPokemons));
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

  const collectEvolutions = (evolutionData: EvolutionData, result: EvolutionResult = []) => {
    if (evolutionData.species) {
      result.push({ name: evolutionData.species.name });
    }
    if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
      for (const evolution of evolutionData.evolves_to) {
        collectEvolutions(evolution, result);
      }
    }
    return result;
  };

  const getSprite = async (pokemonName: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      return data.sprites.front_default;
    } catch (error) {
      console.error('Error fetching sprite:', error);
      return null;
    }
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
    // return pokemonEvolutions;

    const allEvolutions = await Promise.all(
      collectEvolutions(pokemonEvolutions.chain).map(
        async (pokemon: { name: string }): Promise<{ name: string; url: string }> => {
          const url = await getSprite(pokemon.name);
          return { ...pokemon, url };
        }
      )
    );
    
    return allEvolutions;
  };

  return {
    fetchPokemons,
    fetchPokemonDetails,
    fetchPokemonEvolutions,
  };
};
