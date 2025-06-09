"use client"

import { getArrangedTypes, getTypeColor, playPokemonCry } from "@/lib/utils";
import { PokemonDetail } from "../../../actions";
import DetailHeader from "./detail-header";
import DetailImage from "./detail-image";
import BaseStats from "./base-stats";
import { useEffect } from "react";

export default function Detail({
  image,
  pokemon
}: {
  image: string;
  pokemon: PokemonDetail;
}) {
  const arrangedTypes = getArrangedTypes(pokemon.types);

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
        url={image}
        alt={`An image of ${pokemon.name}`}
        bgColor={getTypeColor(arrangedTypes[0])}
      />
      <BaseStats stats={pokemon.stats} />
    </div>
  );
}