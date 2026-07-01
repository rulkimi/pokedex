"use client"

import { playPokemonCry, getArrangedTypes, getTypeColor, formatId, formatName } from "@/lib/utils";
import { PokemonDetail } from "../../../actions";
import BaseStats from "./base-stats";
import About from "./about";
import { useEffect } from "react";
import Evolutions from "./evolutions";
import Variants from "./variants";
import { useDetailsMobileView } from "@/app/pokemons/details-mobile-view-provider";
import { motion } from "motion/react";
import DetailImage from "./detail-image";
import Moves from "./moves";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
};

const PokeballBg = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" className="absolute -right-8 top-4 w-64 h-64 opacity-[0.15] text-white rotate-12 pointer-events-none">
    <circle cx="50" cy="50" r="40" />
    <circle cx="50" cy="50" r="12" />
    <path d="M10 50 H38" />
    <path d="M62 50 H90" />
  </svg>
);

export default function Detail({
  pokemon
}: {
  pokemon: PokemonDetail;
}) {
  const { isOpen, setIsOpen } = useDetailsMobileView();

  useEffect(() => {
    setIsOpen(true);
    return () => {
      setIsOpen(false);
    };
  }, []);

  const arrangedTypes = getArrangedTypes(pokemon.types);
  const primaryColorClass = getTypeColor(arrangedTypes[0]);

  return (
    <div className="relative w-full flex flex-col min-h-full bg-background overflow-x-hidden">
      
      {/* Top Banner (Color + Image) */}
      <motion.div 
        className={`relative ${primaryColorClass} pt-6 pb-24 px-6 flex flex-col items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PokeballBg />

        <div className="w-full flex justify-between items-start z-10 text-white/90 mb-4">
          <div className="flex flex-col gap-2">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-extrabold tracking-tight drop-shadow-md capitalize"
              dangerouslySetInnerHTML={{ __html: formatName(pokemon.name) }}
            />
            <div className="flex gap-2">
              {arrangedTypes.map((type, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 400 }}
                  className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-xs font-bold tracking-widest uppercase shadow-sm"
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </div>
          
          <motion.span 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold opacity-80 drop-shadow-md pt-2"
          >
            {formatId(pokemon.id)}
          </motion.span>
        </div>

        <motion.div 
          className="absolute -bottom-16 z-20"
          initial={{ y: 50, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <DetailImage pokemon={pokemon} onClick={() => playPokemonCry(pokemon.id)} />
        </motion.div>
      </motion.div>

      {/* Bottom Content (Stats, Evolutions) */}
      <div className="bg-background flex-grow rounded-t-[2.5rem] -mt-8 z-10 pt-24 px-6 pb-12 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.3)]">
        <motion.div 
          className="max-w-2xl mx-auto space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <About pokemon={pokemon} />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 border-t border-border/50">
            <BaseStats stats={pokemon.stats} />
          </motion.div>

          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <motion.div variants={itemVariants} className="pt-4 border-t border-border/50">
              <Evolutions evolutions={pokemon.evolutions} />
            </motion.div>
          )}

          {pokemon.variants && pokemon.variants.length > 1 && (
            <motion.div variants={itemVariants} className="pt-4 border-t border-border/50">
              <Variants variants={pokemon.variants} speciesId={pokemon.speciesId} />
            </motion.div>
          )}

          {pokemon.moves && pokemon.moves.length > 0 && (
            <motion.div variants={itemVariants} className="pt-4 border-t border-border/50">
              <Moves moves={pokemon.moves} />
            </motion.div>
          )}
        </motion.div>
      </div>

    </div>
  );
}