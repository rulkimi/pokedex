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
  
  interface TypeInfo {
    slot: number
    type: {
      name: string
      url: string
    }
  }
  
}

export { 
  Generation,
  Pokemon,
  PokeAPIResponse,
  PokemonResponse,
  TypeInfo,
};