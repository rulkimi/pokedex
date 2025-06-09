import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

export default async function PokemonDetailPage({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;
  const pokemon = await fetchPokemonById(pokemonId);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  if (!pokemon) return <div>Pokemon not found</div>

  return <PokemonDetail pokemon={pokemon} image={imageUrl} />
}