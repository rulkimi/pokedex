"use client"

import { playPokemonCry } from "@/lib/utils";
import { PokemonDetail } from "../../../actions";
import DetailHeader from "./detail-header";
import DetailImage from "./detail-image";
import BaseStats from "./base-stats";
import { useEffect } from "react";
import Evolutions from "./evolutions";
import { useDetailsMobileView } from "@/app/pokemons/details-mobile-view-provider";

export default function Detail({
  pokemon
}: {
  pokemon: PokemonDetail;
}) {
  const { isOpen, setIsOpen } = useDetailsMobileView();

  useEffect(() => {
    setIsOpen(true);
    // playPokemonCry(pokemon.id);

    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <div className="space-y-2">
      <DetailHeader
        id={pokemon.id}
        name={pokemon.name}
      />
      <DetailImage pokemon={pokemon} />
      <BaseStats stats={pokemon.stats} />
      {pokemon.evolutions && (
        <Evolutions evolutions={pokemon.evolutions} />
      )}
    </div>
  );
}