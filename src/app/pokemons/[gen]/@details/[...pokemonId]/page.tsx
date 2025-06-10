import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

export default async function PokemonDetailPage({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;

  if (pokemonId == 0) return <PlaceholderText text="Select a pokemon" />

  const pokemon = await fetchPokemonById(pokemonId);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  
  if (!pokemon) return <PlaceholderText text="Pokemon not found!" />

  return <PokemonDetail pokemon={pokemon} image={imageUrl} />
}

const PlaceholderText = ({ text }: { text: string}) => {
  return (
    <div className="h-full w-full flex justify-center items-center text-muted-foreground">
      {text}
    </div>
  );
};