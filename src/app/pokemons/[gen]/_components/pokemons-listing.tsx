import PokemonListingClient from "./pokemons-listing-client";
import { fetchPokemons } from "../actions";

export default async function PokemonsListing({ gen }: { gen: number }) {
  const pokemons = await fetchPokemons({ gen });
  return <PokemonListingClient gen={gen} pokemons={pokemons} />;
}
