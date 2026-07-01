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
  trim = false,
}: {
  pokemonId: number;
  imageSize?: number;
  className?: string;
  alt: string;
  loading?: "lazy" | "eager";
  fallbackPokemonId?: number;
  trim?: boolean;
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
  const [trimmedSrc, setTrimmedSrc] = useState<string | null>(null);
  const [trimmedDim, setTrimmedDim] = useState<{width: number, height: number} | null>(null);

  useEffect(() => {
    setFallbackIndex(0);
    setTrimmedSrc(null);
    setTrimmedDim(null);
  }, [pokemonId, spriteType]);

  const imgSrc = fallbacks[fallbackIndex] || fallbacks[0];

  useEffect(() => {
    if (!trim || typeof window === "undefined") return;
    
    let isMounted = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        let top = 0, bottom = canvas.height, left = 0, right = canvas.width;
        
        // Find top
        for (let y = 0; y < canvas.height; y++) {
          let hasAlpha = false;
          for (let x = 0; x < canvas.width; x++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 10) { hasAlpha = true; break; }
          }
          if (hasAlpha) { top = y; break; }
        }
        
        // Find bottom
        for (let y = canvas.height - 1; y >= 0; y--) {
          let hasAlpha = false;
          for (let x = 0; x < canvas.width; x++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 10) { hasAlpha = true; break; }
          }
          if (hasAlpha) { bottom = y; break; }
        }
        
        // Find left
        for (let x = 0; x < canvas.width; x++) {
          let hasAlpha = false;
          for (let y = 0; y < canvas.height; y++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 10) { hasAlpha = true; break; }
          }
          if (hasAlpha) { left = x; break; }
        }
        
        // Find right
        for (let x = canvas.width - 1; x >= 0; x--) {
          let hasAlpha = false;
          for (let y = 0; y < canvas.height; y++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 10) { hasAlpha = true; break; }
          }
          if (hasAlpha) { right = x; break; }
        }
        
        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;
        
        if (cropWidth > 0 && cropHeight > 0) {
          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = cropWidth;
          cropCanvas.height = cropHeight;
          const cropCtx = cropCanvas.getContext("2d");
          if (cropCtx) {
            cropCtx.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            if (isMounted) {
              setTrimmedDim({ width: cropWidth, height: cropHeight });
              setTrimmedSrc(cropCanvas.toDataURL());
            }
          }
        } else {
          if (isMounted) setTrimmedSrc(imgSrc);
        }
      } catch (e) {
        if (isMounted) setTrimmedSrc(imgSrc);
      }
    };
    
    img.onerror = () => {
      if (isMounted) setTrimmedSrc(imgSrc);
    };
    
    img.src = imgSrc;

    return () => { isMounted = false; };
  }, [imgSrc, trim]);

  const finalSrc = trim ? (trimmedSrc || imgSrc) : imgSrc;

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
          src={finalSrc}
          width={trim && trimmedDim ? trimmedDim.width : size}
          height={trim && trimmedDim ? trimmedDim.height : size}
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
