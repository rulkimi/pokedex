import { capitalizeFirstLetter, formatId, formatStat, getArrangedTypes, getStatWidth, getTotalStats, getTypeColor } from "@/utils";
import { fetchPokemonById } from "../../actions";
import Image from "next/image";
import DetailHeader from "./_components/detail-header";
import DetailImage from "./_components/detail-image";
import BaseStats from "./_components/base-stats";

interface PokemonDetailProps {
  params: Promise<{ pokemonId: number }>
}

export default async function PokemonDetail({ params }: PokemonDetailProps) {
  const { pokemonId } = await params;
  const pokemon = await fetchPokemonById(pokemonId);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  if (!pokemon) return <div>Pokemon not found</div>

  const arrangedTypes = getArrangedTypes(pokemon.types);

  return (
    <div className="space-y-2">
      <DetailHeader
        id={pokemonId}
        name={pokemon.name}
      />
      <DetailImage
        url={imageUrl}
        alt={`An image of ${pokemon.name}`}
        bgColor={getTypeColor(arrangedTypes[0])}
      />
      <BaseStats stats={pokemon.stats} />
    </div>
  );
}