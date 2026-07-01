import Image from "next/image";
import { useState, useEffect } from "react";
import { useSprite } from "../../sprite-provider";
import { getDefaultPokemonImageUrl, getPokemonImageUrl, getHomePokemonImageUrl, getShowdownPokemonImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function PokemonImage({
  pokemonId,
  imageSize = 80,
  className,
  alt,
  loading = "lazy",
  fallbackPokemonId,
}: {
  pokemonId: number;
  imageSize?: number;
  className?: string;
  alt: string;
  loading?: "lazy" | "eager";
  fallbackPokemonId?: number;
}) {
  const { spriteType } = useSprite();

  let inferredFallbackId = fallbackPokemonId;
  if (!inferredFallbackId && pokemonId > 10000) {
    const altLower = alt.toLowerCase();
    if (altLower.includes("koraidon")) inferredFallbackId = 1007;
    else if (altLower.includes("miraidon")) inferredFallbackId = 1008;
    else if (altLower.includes("pikachu")) inferredFallbackId = 25;
    else if (altLower.includes("charizard")) inferredFallbackId = 6;
    else if (altLower.includes("venusaur")) inferredFallbackId = 3;
    else if (altLower.includes("blastoise")) inferredFallbackId = 9;
    else if (altLower.includes("urshifu")) inferredFallbackId = 892;
    else if (altLower.includes("calyrex")) inferredFallbackId = 898;
    else if (altLower.includes("ogerpon")) inferredFallbackId = 1017;
    else if (altLower.includes("terapagos")) inferredFallbackId = 1024;
  }

  const getFallbacks = () => {
    const artwork = getPokemonImageUrl(pokemonId);
    const home = getHomePokemonImageUrl(pokemonId);
    const def = getDefaultPokemonImageUrl(pokemonId);
    const showdown = getShowdownPokemonImageUrl(pokemonId);
    const sv = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ix/scarlet-violet/${pokemonId}.png`;

    let arr: string[] = [];

    switch (spriteType) {
      case "artwork":
        arr = [artwork, home, def, showdown, sv];
        break;
      case "home":
        arr = [home, artwork, showdown, def, sv];
        break;
      case "showdown":
        arr = [showdown, def, home, artwork, sv];
        break;
      case "default":
      default:
        arr = [def, showdown, home, artwork, sv];
        break;
    }

    if (inferredFallbackId) {
      arr.push(
        getPokemonImageUrl(inferredFallbackId),
        getDefaultPokemonImageUrl(inferredFallbackId),
        getHomePokemonImageUrl(inferredFallbackId)
      );
    }
    
    // Absolute final fallback if PokeAPI has literally nothing
    arr.push("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png");

    return arr;
  };

  const fallbacks = getFallbacks();

  const imageSizeFactor = spriteType === "artwork" ? 1 : 1;
  const size = imageSize * imageSizeFactor;

  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    setFallbackIndex(0);
  }, [pokemonId, spriteType]);

  const imgSrc = fallbacks[fallbackIndex] || fallbacks[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={fallbacks[0]}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none"
      >
        <Image
          src={imgSrc}
          width={size}
          height={size}
          className={className}
          alt={alt}
          loading={loading}
          onError={() => {
            if (fallbackIndex < fallbacks.length - 1) {
              setFallbackIndex(prev => prev + 1);
            }
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
