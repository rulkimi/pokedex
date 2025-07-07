import { formatName } from "@/lib/utils";
import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";
import { Metadata } from "next";

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

export async function generateMetadata({ params }: PokemonDetailProps): Promise<Metadata> {
  const { pokemonId } = await params;
  
  if (pokemonId == 0) {
    return {
      title: 'Pokémon'
    }
  }

  const pokemon = await fetchPokemonById(pokemonId);

  if (!pokemon) {
    return {
      title: 'Pokemon Not Found'
    }
  }

  return {
    title: `${formatName(pokemon.name)} - Pokémon Details`,
    description: `View details about ${pokemon.name}, Pokémon #${pokemon.id}`,
    openGraph: {
      images: [
        {
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
          width: 475,
          height: 475,
          alt: pokemon.name
        }
      ]
    }
  }
}

export default async function PokemonDetailPage({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;

  if (pokemonId == 0) return <PlaceholderText text="Select a pokemon" />

  const pokemon = await fetchPokemonById(pokemonId);

  if (!pokemon) return <PlaceholderText text="Pokemon not found!" />

  return <PokemonDetail pokemon={pokemon} />
}
