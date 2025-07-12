import Image from "next/image";
import { useSprite } from "../../sprite-provider";
import { getDefaultPokemonImageUrl, getPokemonImageUrl } from "@/lib/utils";
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
  const imageUrl =
    spriteType === "artwork"
      ? getPokemonImageUrl(pokemonId)
      : getDefaultPokemonImageUrl(pokemonId);
  const imageSizeFactor = spriteType === "artwork" ? 1 : 1;
  const size = imageSize * imageSizeFactor;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={imageUrl}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none"
      >
        <Image
          src={imageUrl}
          width={size}
          height={size}
          className={className}
          alt={alt}
          loading={loading}
        />
      </motion.div>
    </AnimatePresence>
  );
}
