"use client"

import { formatName, getPokemonGen, playPokemonCry } from "@/lib/utils";
import { useRouter } from "next/navigation";
import PokemonImage from "../../../_components/pokemon-image";

export default function Variants({ variants, speciesId }: { variants: { id: number; name: string }[], speciesId: number }) {
  const router = useRouter();
  
  const handleVariantClick = (pokemonId: number) => {
    playPokemonCry(pokemonId);
    const pokemonGen = getPokemonGen(pokemonId);
    const pokemonUrl = `/pokemons/${pokemonGen}/${pokemonId}`;
    router.push(pokemonUrl)
  }
  
  return (
    <section className="space-y-2 mt-4">
      <h2 className="text-lg font-bold uppercase">Forms & Variants</h2>
      <ul className="grid grid-cols-3 gap-2 place-items-center">
        {variants.map((variant) => {
          return (
            <li
              key={variant.id}
              onClick={() => handleVariantClick(variant.id)}
            >
              <PokemonImage
                pokemonId={variant.id}
                fallbackPokemonId={speciesId}
                imageSize={100}
                className="object-cover group-hover:scale-150 transition-transform duration-300 cursor-pointer hover:scale-105"
                alt={`An image of ${variant.name}`}
              />
              <p
                className="text-sm text-center"
                dangerouslySetInnerHTML={{ __html: formatName(variant.name)}}
              ></p>
            </li>
          )
        })}
      </ul>
    </section>
  );
}
