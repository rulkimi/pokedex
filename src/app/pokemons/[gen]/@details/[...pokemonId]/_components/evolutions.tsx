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
      <ul className="flex flex-wrap gap-4 justify-center items-end">
        {evolutions.map((evolution, index) => {
          return (
            <li
              key={evolution.id}
              onClick={() => handleEvolutionClick(evolution.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <PokemonImage
                pokemonId={evolution.id}
                imageSize={90}
                className="object-cover group-hover:scale-125 transition-transform duration-300 drop-shadow-md"
                alt={`An image of ${evolution.name}`}
              />
              <div className="flex flex-col items-center">
                <p
                  className="text-sm font-bold text-center capitalize"
                  dangerouslySetInnerHTML={{ __html: formatName(evolution.name)}}
                />
                {index === 0 ? (
                  <div className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>Base Form</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {(() => {
                      const renderTrigger = () => {
                        if (evolution.trigger === 'use-item' && evolution.item) {
                          return (
                            <>
                              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolution.item}.png`} className="w-4 h-4 [image-rendering:pixelated]" alt={evolution.item} />
                              <span>{evolution.item.replace('-', ' ')}</span>
                            </>
                          );
                        }
                        if (evolution.trigger === 'trade') {
                          return (
                            <>
                              <span>Trade</span>
                              {evolution.held_item && (
                                <>
                                  <span> w/ </span>
                                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolution.held_item}.png`} className="w-4 h-4 [image-rendering:pixelated]" alt={evolution.held_item} />
                                </>
                              )}
                            </>
                          )
                        }
                        
                        let text = "";
                        if (evolution.level) text += `Lvl ${evolution.level} `;
                        if (evolution.happiness) text += `Happiness `;
                        if (evolution.time_of_day) text += evolution.time_of_day === 'day' ? '☀️ ' : evolution.time_of_day === 'night' ? '🌙 ' : '';
                        if (evolution.known_move) text += `(Move: ${evolution.known_move.replace('-', ' ')}) `;
                        if (evolution.location) text += `(@ ${evolution.location.replace('-', ' ')}) `;

                        return <span>{text || "Other"}</span>;
                      };

                      return renderTrigger();
                    })()}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  );
}