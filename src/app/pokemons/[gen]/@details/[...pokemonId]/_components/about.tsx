"use client"

import { useState, useEffect } from "react";
import { PokemonDetail } from "../../../actions";
import { formatName } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Ruler, Share2, Check, ChevronDown } from "lucide-react";

import { getComparisonMessage } from "@/lib/height-messages";
export default function About({ pokemon }: { pokemon: PokemonDetail }) {
  const [showCompare, setShowCompare] = useState(false);
  const [userHeight, setUserHeight] = useState("170");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedHeight = localStorage.getItem("pokedexUserHeight");
    if (savedHeight) {
      setUserHeight(savedHeight);
    }
  }, []);

  const pokeHeightM = pokemon.height / 10;
  const pokeWeightKg = pokemon.weight / 10;

  const handleCompare = () => {
    const h = parseFloat(userHeight);
    if (isNaN(h) || h <= 0) return;
    localStorage.setItem("pokedexUserHeight", userHeight);
    setMessage(getComparisonMessage(h, pokemon.name, pokeHeightM));
  };

  const handleShare = async () => {
    if (!message) return;
    let name = formatName(pokemon.name).replace(/<[^>]*>/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Get the current page URL to include in the share message
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    const text = `How tall are you compared to ${name}?\n\n${message}\n\n${url}\n#PokédexByrulkimi`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} Size Comparison`, text });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Row: About title + Height/Weight */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">About</h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-medium">{pokeHeightM.toFixed(1)}m</span>
            <span className="text-border">·</span>
            <span className="font-medium">{pokeWeightKg.toFixed(1)}kg</span>
          </div>
          <button 
            onClick={() => { setShowCompare(!showCompare); if (!showCompare && !message) handleCompare(); }}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Compare</span>
            <motion.div animate={{ rotate: showCompare ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Compare Height Panel */}
      <AnimatePresence>
        {showCompare && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/30 rounded-xl border border-border/50 px-3 py-2.5 space-y-2">
              <div className="relative flex items-center w-full">
                <input 
                  type="number"
                  value={userHeight}
                  onChange={(e) => setUserHeight(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                  className="w-full h-12 pl-4 pr-24 text-sm font-semibold rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter your height (cm)"
                />
                <button
                  onClick={handleCompare}
                  className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-xl px-5 font-bold text-xs bg-foreground text-background hover:opacity-80 transition-opacity"
                >
                  Go
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-start gap-2"
                  >
                    <p className="text-xs leading-relaxed italic text-muted-foreground flex-1 whitespace-pre-wrap">
                      "{message}"
                    </p>
                    <button
                      onClick={handleShare}
                      className="flex-shrink-0 mt-0.5 p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title={copied ? "Copied!" : "Share"}
                    >
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Share2 className="w-3 h-3" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {pokemon.description && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {pokemon.description}
        </p>
      )}

      <div className="space-y-3 pt-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span className="text-muted-foreground font-medium col-span-1">Abilities</span>
          <div className="col-span-2 flex flex-col gap-1">
            {pokemon.abilities.map((ability, idx) => (
              <span key={idx} className={`capitalize ${ability.is_hidden ? 'text-muted-foreground text-xs' : 'font-medium'}`}>
                {ability.name.replace('-', ' ')} {ability.is_hidden && '(Hidden)'}
              </span>
            ))}
          </div>
        </div>

        {pokemon.base_experience > 0 && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Base Exp.</span>
            <span className="col-span-2 font-medium">{pokemon.base_experience}</span>
          </div>
        )}

        {pokemon.habitat && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Habitat</span>
            <span className="col-span-2 font-medium capitalize">{pokemon.habitat.replace('-', ' ')}</span>
          </div>
        )}

        {pokemon.egg_groups && pokemon.egg_groups.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Egg Groups</span>
            <span className="col-span-2 font-medium capitalize">{pokemon.egg_groups.join(', ').replace('-', ' ')}</span>
          </div>
        )}

        {pokemon.gender_rate !== undefined && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground font-medium col-span-1">Gender</span>
            <span className="col-span-2 font-medium">
              {pokemon.gender_rate === -1 ? (
                "Genderless"
              ) : (
                <div className="flex gap-4">
                  <span className="text-blue-500">♂ {((8 - pokemon.gender_rate) / 8 * 100).toFixed(1)}%</span>
                  <span className="text-pink-500">♀ {(pokemon.gender_rate / 8 * 100).toFixed(1)}%</span>
                </div>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
