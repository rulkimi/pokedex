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
      // Joyful Hop
      async () => {
        const height = getRandomValue(30, 45);
        const sequence = [
          { y: 0, scaleY: 1, scaleX: 1, transition: { duration: 0.05 } },
          { y: -height, scaleY: 1.05, scaleX: 0.95, transition: { duration: 0.25, ease: "easeOut" } },
          { y: 0, scaleY: 0.9, scaleX: 1.1, transition: { duration: 0.15, ease: "easeIn" } },
          { y: -height/2.5, scaleY: 1.02, scaleX: 0.98, transition: { duration: 0.15, ease: "easeOut" } },
          { y: 0, scaleY: 1, scaleX: 1, transition: { duration: 0.15, ease: "easeInOut" } }
        ];
        for (const pos of sequence) {
          await controls.start(pos);
        }
      },
      // Breathe / Roar
      async () => {
        const scale = getRandomValue(1.15, 1.25);
        const sequence = [
          { scale: 1 },
          { scale, transition: { duration: 0.35, ease: "easeOut" } },
          { scale: 1, transition: { duration: 0.3, ease: "easeInOut" } }
        ];
        for (const pos of sequence) {
          await controls.start(pos);
        }
      },
      // Curious Head Tilt
      async () => {
        const angle = getRandomValue(12, 18);
        const sequence = [
          { rotate: 0 },
          { rotate: angle, transition: { duration: 0.25, ease: "easeInOut" } },
          { rotate: -angle * 0.8, transition: { duration: 0.3, ease: "easeInOut" } },
          { rotate: angle * 0.4, transition: { duration: 0.25, ease: "easeInOut" } },
          { rotate: 0, transition: { duration: 0.25, ease: "easeInOut" } }
        ];
        for (const pos of sequence) {
          await controls.start(pos);
        }
      },
      // Levitating / Drifting
      async () => {
        const x = getRandomValue(-15, 15);
        const y = getRandomValue(-25, -15);
        const rotate = getRandomValue(-8, 8);
        const scale = Math.random() > 0.5 ? 1.1 : 0.95;

        const sequence = [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x, y, rotate, scale, transition: { duration: 0.5, ease: "easeInOut" } },
          { x: -x * 0.5, y: y * 0.5, rotate: -rotate * 0.5, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
          { x: 0, y: 0, rotate: 0, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } }
        ];

        for (const pos of sequence) {
          await controls.start(pos);
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
          fallbackPokemonId={pokemon.speciesId}
          alt={`An image of ${pokemon.name}.`}
          imageSize={220}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </motion.div>
    </section>
  );
}
