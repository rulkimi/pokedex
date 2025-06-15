"use client"

import { formatName, getPokemonGen, playPokemonCry } from "@/lib/utils";
import { Evolution } from "../../../actions";
import { useRouter } from "next/navigation";
import PokemonImage from "../../../_components/pokemon-image";

export default function Evolutions({ evolutions }: { evolutions: Evolution[] }) {
  const router = useRouter();
  
  const handleEvolutionClick = (pokemonId: number,) => {
    playPokemonCry(pokemonId);
    const pokemonGen = getPokemonGen(pokemonId);
    const pokemonUrl = `/pokemons/${pokemonGen}/${pokemonId}`;
    router.push(pokemonUrl)
  }
  
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold uppercase">Evolutions</h2>
      <ul className="grid grid-cols-3 gap-2 place-items-center">
        {evolutions.map((evolution) => {

          return (
            <li
              key={evolution.id}
              onClick={() => handleEvolutionClick(evolution.id)}
            >
              <PokemonImage
                pokemonId={evolution.id}
                imageSize={100}
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