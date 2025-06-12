"use client"

import { getArrangedTypes, getDefaultPokemonImageUrl, getPokemonImageUrl, getTypeColor, playPokemonCry } from "@/lib/utils";
import { PokemonDetail } from "../../../actions";
import DetailHeader from "./detail-header";
import DetailImage from "./detail-image";
import BaseStats from "./base-stats";
import { useEffect } from "react";
import Evolutions from "./evolutions";
import { useSprite } from "../../../sprite-provider";

export default function Detail({
  pokemon
}: {
  pokemon: PokemonDetail;
}) {
  const arrangedTypes = getArrangedTypes(pokemon.types);
  const { spriteType } = useSprite();

  const imageUrl = spriteType === 'artwork' ? getPokemonImageUrl(pokemon.id) : getDefaultPokemonImageUrl(pokemon.id);

  useEffect(() => {
    playPokemonCry(pokemon.id);
  }, []);

  return (
    <div className="space-y-2">
      <DetailHeader
        id={pokemon.id}
        name={pokemon.name}
      />
      <DetailImage
        url={imageUrl}
        alt={`An image of ${pokemon.name}`}
        bgColor={getTypeColor(arrangedTypes[0])}
      />
      <BaseStats stats={pokemon.stats} />
      {pokemon.evolutions && (
        <Evolutions evolutions={pokemon.evolutions} />
      )}
    </div>
  );
}