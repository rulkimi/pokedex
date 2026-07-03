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
      <h2 className="text-lg font-bold uppercase">Variants</h2>
      <ul className="flex flex-wrap gap-4 justify-center items-end">
        {variants.filter(v => v.id !== speciesId).map((variant) => {
          return (
            <li
              key={variant.id}
              onClick={() => handleVariantClick(variant.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <PokemonImage
                pokemonId={variant.id}
                fallbackPokemonId={speciesId}
                imageSize={90}
                className="object-cover group-hover:scale-125 transition-transform duration-300 drop-shadow-md"
                alt={`An image of ${variant.name}`}
              />
              <div className="flex flex-col items-center">
                <p
                  className="text-sm font-bold text-center capitalize"
                  dangerouslySetInnerHTML={{ __html: formatName(variant.name)}}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  );
}
