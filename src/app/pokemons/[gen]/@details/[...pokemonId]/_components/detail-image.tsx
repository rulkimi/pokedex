"use client"

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import PokemonImage from "../../../_components/pokemon-image";
import { PokemonDetail } from "../../../actions";
import { getArrangedTypes, getTypeColor } from "@/lib/utils";

export default function DetailImage({
  pokemon,
  onClick,
}: {
  pokemon: PokemonDetail;
  onClick?: () => void;
}) {
  const controls = useAnimation();

  const getRandomValue = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const getRandomAnimation = () => {
    const animations = [
      // Bounce animation
      async () => {
        const height = getRandomValue(20, 40);
        const sequence = [
          { y: 0 },
          { y: -height },
          { y: 0 },
          { y: -height/2 },
          { y: 0 }
        ];
        for (const pos of sequence) {
          await controls.start({
            ...pos,
            transition: { duration: 0.2, ease: "easeInOut" }
          });
        }
      },
      // Pulse animation
      async () => {
        const scale = getRandomValue(1.1, 1.3);
        const sequence = [
          { scale: 1 },
          { scale },
          { scale: 1 },
          { scale },
          { scale: 1 }
        ];
        for (const pos of sequence) {
          await controls.start({
            ...pos,
            transition: { duration: 0.2, ease: "easeInOut" }
          });
        }
      },
      // Wiggle
      async () => {
        const angle = getRandomValue(10, 20);
        const sequence = [
          { rotate: 0 },
          { rotate: angle },
          { rotate: -angle },
          { rotate: angle },
          { rotate: 0 }
        ];
        for (const pos of sequence) {
          await controls.start({
            ...pos,
            transition: { duration: 0.15, ease: "easeInOut" }
          });
        }
      },
      // Floating animation
      async () => {
        const x = getRandomValue(-30, 30);
        const y = getRandomValue(-30, 30);
        const rotate = getRandomValue(-20, 20);
        const shouldAddScale = Math.random() > 0.5;

        const sequence = [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x, y, rotate, scale: shouldAddScale ? 1.25 : 1 },
          { x: -x, y: -y, rotate: -rotate, scale: shouldAddScale ? 1.25 : 1 },
          { x, y, rotate, scale: shouldAddScale ? 1.25 : 1 },
          { x: 0, y: 0, rotate: 0, scale: 1 }
        ];

        for (const pos of sequence) {
          await controls.start({
            ...pos,
            transition: { duration: 0.3, ease: "easeInOut" }
          });
        }
      }
    ];

    return animations[Math.floor(Math.random() * animations.length)];
  };

  const triggerAnimation = async () => {
    const animation = getRandomAnimation();
    await animation();
  };

  const arrangedTypes = getArrangedTypes(pokemon.types);
  const bgColor = getTypeColor(arrangedTypes[0]);

  useEffect(() => {
    triggerAnimation();
  }, []);

  return (
    <section
      className="relative flex justify-center items-center group cursor-pointer w-fit mx-auto"
      onClick={() => {
        onClick?.();
        triggerAnimation();
      }}
    >
      <motion.div animate={controls}>
        <PokemonImage
          pokemonId={pokemon.id}
          alt={`An image of ${pokemon.name}.`}
          imageSize={200}
          className="object-cover group-hover:scale-150 transition-transform duration-300"
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`shadow-inner w-40 h-40 ${bgColor}/5 group-hover:${bgColor}/20 transition-colors duration-300 rounded-full z-[-1]`}
        />
      </div>
    </section>
  );
}
