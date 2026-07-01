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
}: {
  pokemonId: number;
  imageSize?: number;
  className?: string;
  alt: string;
  loading?: "lazy" | "eager";
}) {
  const { spriteType } = useSprite();

  const getFallbacks = () => {
    const artwork = getPokemonImageUrl(pokemonId);
    const home = getHomePokemonImageUrl(pokemonId);
    const def = getDefaultPokemonImageUrl(pokemonId);
    const showdown = getShowdownPokemonImageUrl(pokemonId);

    switch (spriteType) {
      case "artwork":
        return [artwork, home, def, showdown];
      case "home":
        return [home, artwork, showdown, def];
      case "showdown":
        return [showdown, def, home, artwork];
      case "default":
      default:
        return [def, showdown, home, artwork];
    }
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
