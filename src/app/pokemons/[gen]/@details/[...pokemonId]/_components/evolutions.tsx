"use client"

import { formatName, getDefaultPokemonImageUrl, getPokemonGen, getPokemonImageUrl } from "@/lib/utils";
import { Evolution } from "../../../actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSprite } from "../../../sprite-provider";

export default function Evolutions({ evolutions }: { evolutions: Evolution[] }) {
  const router = useRouter();
  const { spriteType } = useSprite();
  
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold uppercase">Evolutions</h2>
      <ul className="grid grid-cols-3 gap-2 place-items-center">
        {evolutions.map((evolution) => {
          const imageUrl = spriteType === 'artwork' ? getPokemonImageUrl(evolution.id) : getDefaultPokemonImageUrl(evolution.id);
          const pokemonGen = getPokemonGen(evolution.id);

          const pokemonUrl = `/pokemons/${pokemonGen}/${evolution.id}`;
          return (
            <li
              key={evolution.id}
              onClick={() => router.push(pokemonUrl)}
            >
              <Image
                src={imageUrl}
                width={100}
                height={100}
                className="object-cover group-hover:scale-150 transition-transform duration-300 cursor-pointer hover:scale-105"
                alt={`An image of ${evolution.name}`}
              />
              <p
                className="text-sm text-center"
                dangerouslySetInnerHTML={{ __html: formatName(evolution.name)}}
              ></p>
            </li>
          )
        })}
      </ul>
    </section>
  );
}