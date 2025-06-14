import Image from "next/image";
import { useSprite } from "../sprite-provider";
import { getDefaultPokemonImageUrl, getPokemonImageUrl } from "@/lib/utils";

export default function PokemonImage({
  pokemonId,
  imageSize = 80,
  className,
  alt,
  loading = "lazy"
}: {
  pokemonId: number;
  imageSize?: number;
  className?: string;
  alt: string;
  loading?: "lazy" | "eager";
}) {
  const { spriteType } = useSprite();
  const imageUrl = spriteType === 'artwork' ? getPokemonImageUrl(pokemonId) : getDefaultPokemonImageUrl(pokemonId);
  const imageSizeFactor = spriteType === 'artwork' ? 1 : 1;
  const size = imageSize * imageSizeFactor;
  
  return (
    <Image
      src={imageUrl}
      width={size}
      height={size}
      className={className}
      alt={alt}
      loading={loading}
    />
  );
}