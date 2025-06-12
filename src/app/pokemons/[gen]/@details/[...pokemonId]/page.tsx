import { getPokemonImageUrl } from "@/lib/utils";
import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

const PlaceholderText = ({ text }: { text: string}) => {
  return (
    <div className="h-full w-full flex justify-center items-center text-muted-foreground">
      {text}
    </div>
  );
};

export default async function PokemonDetailPage({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;

  if (pokemonId == 0) return <PlaceholderText text="Select a pokemon" />

  const pokemon = await fetchPokemonById(pokemonId);
  const imageUrl = getPokemonImageUrl(pokemonId);

  if (!pokemon) return <PlaceholderText text="Pokemon not found!" />

  return <PokemonDetail pokemon={pokemon} image={imageUrl} />
}

