import PokemonListingClient from "./pokemons-listing-client";
import { fetchPokemons } from "../actions";
import fs from "fs/promises";
import path from "path";

export default async function PokemonsListing({ gen }: { gen: number }) {
  const pokemons = await fetchPokemons({ gen });
  
  let allPokemons: { id: number; name: string; types: string[]; gen: number }[] = [];
  try {
    const filePath = path.join(process.cwd(), "public", "pokemons.json");
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);
    allPokemons = Object.entries(data).map(([id, val]: any) => ({
      id: parseInt(id),
      name: val.name,
      types: val.types || [],
      gen: val.gen || 1,
    }));
  } catch (e) {
    console.error("Failed to load pokemons.json", e);
  }

  return <PokemonListingClient gen={gen} pokemons={pokemons} allPokemons={allPokemons} />;
}
