import { Metadata } from "next";
import { getPokemonImageUrl } from "@/lib/utils";
import { fetchPokemonById } from "../../actions";
import PokemonDetail from "./_components/pokemon-detail";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: PokemonDetailProps): Promise<Metadata> {
  const { pokemonId } = await params;

  if (pokemonId == 0) {
    return {
      title: "Pokédex by rulkimi — Select a Pokémon",
      description: "Browse and explore detailed Pokémon data in this unofficial Pokédex built with PokéAPI. Select a Pokémon to view its stats, abilities, evolutions, and more.",
    };
  }

  const pokemon = await fetchPokemonById(pokemonId);

  if (!pokemon) {
    return {
      title: "Pokémon Not Found — Pokédex by rulkimi",
      description: "The requested Pokémon could not be found.",
    };
  }

  const name = formatPokemonName(pokemon.name);
  const types = pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' / ');
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const id = `#${String(pokemon.id).padStart(4, '0')}`;
  const abilities = pokemon.abilities.map(a => 
    a.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  ).join(', ');

  const desc = pokemon.description 
    ? `${pokemon.description} ` 
    : '';

  const description = `${desc}${name} (${id}) is a ${types}-type Pokémon. Height: ${heightM}m, Weight: ${weightKg}kg. Find out how tall you are compared to ${name}! Abilities: ${abilities}.`;

  const imageUrl = getPokemonImageUrl(pokemon.id);

  const keywords = [
    name,
    ...pokemon.types,
    `pokemon ${id}`,
    `${name} stats`,
    `${name} evolution`,
    `${name} height`,
    `${name} size comparison`,
    `how tall is ${name}`,
    `${name} abilities`,
    `${name} pokédex`,
    'pokédex',
    'pokemon',
    ...pokemon.abilities.map(a => a.name.replace('-', ' ')),
  ];

  const ogImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return {
    title: `${name} | Pokédex by rulkimi`,
    description: description.slice(0, 160),
    keywords: keywords.join(', '),
    openGraph: {
      title: `${name} | Pokédex by rulkimi`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 475,
          height: 475,
          alt: `${name} Official Artwork`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${name} | Pokédex by rulkimi`,
      description: description.slice(0, 160),
      images: [ogImageUrl],
    },
  };
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
