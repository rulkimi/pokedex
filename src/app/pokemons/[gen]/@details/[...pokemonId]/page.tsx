import { getPokemonImageUrl } from "@/lib/utils";
import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

const PlaceholderText = ({ text }: { text: string}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[70vh] bg-background">
      <div className="flex flex-col items-center space-y-4 opacity-50">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          className="w-20 h-20 text-muted-foreground opacity-60"
        >
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="12" />
          <path d="M10 50 H38" />
          <path d="M62 50 H90" />
        </svg>
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="text-xl font-medium tracking-tight text-foreground">{text}</h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Select a Pokémon from the list to view its complete Pokédex data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default async function PokemonDetailPage({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;

  if (pokemonId == 0) return <PlaceholderText text="Select a pokemon" />

  const pokemon = await fetchPokemonById(pokemonId);

  if (!pokemon) return <PlaceholderText text="Pokemon not found!" />

  return <PokemonDetail pokemon={pokemon} />
}

