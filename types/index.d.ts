declare global {
  interface Generation {
    limit: number
    offset: number
  }

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

  interface PokemonDetail {
    id: number
    name: string
    types: Array<{
      slot: number
      type: {
        name: string
        url: string
      }
    }>
    stats: Array<{
      base_stat: number
      effort: number
      stat: {
        name: string
        url: string
      }
    }>
    sprites: {
      front_default: string
    }
  }
  
  interface TypeInfo {
    slot: number
    type: {
      name: string
      url: string
    }
  }

  type EvolutionData = {
    species: { name: string };
    evolves_to?: EvolutionData[];
  };
  
  type EvolutionResult = { name: string }[];
  
}

export { 
  Generation,
  Pokemon,
  PokeAPIResponse,
  PokemonResponse,
  PokemonDetail,
  TypeInfo,
  EvolutionData,
  EvolutionResult,
};