"use client"

import { useState } from "react";
import { PokemonDetail } from "../../../actions";
import { formatName } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Ruler, Share2, Check, ChevronDown } from "lucide-react";

function getComparisonMessage(userCm: number, pokemonName: string, pokeHeightM: number): string {
  const userM = userCm / 100;
  const ratio = pokeHeightM / userM;
  const name = formatName(pokemonName).replace(/<[^>]*>/g, '');
  const diff = Math.abs(pokeHeightM - userM);
  const diffCm = Math.round(diff * 100);

  if (ratio > 5) {
    const msgs = [
      `${name} is absolutely colossal — ${pokeHeightM.toFixed(1)}m tall! You'd barely reach its ankle. It's ${diffCm}cm taller than you.`,
      `At ${pokeHeightM.toFixed(1)}m, ${name} would cast a shadow over your entire house. You're just a speck at ${userM.toFixed(2)}m!`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio > 3) {
    const msgs = [
      `${name} towers over you at ${pokeHeightM.toFixed(1)}m. You'd need binoculars to see its face — it's ${diffCm}cm taller!`,
      `Standing at ${pokeHeightM.toFixed(1)}m, ${name} makes your ${userM.toFixed(2)}m feel incredibly small. That's a ${diffCm}cm difference!`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio > 1.5) {
    const msgs = [
      `${name} is noticeably taller at ${pokeHeightM.toFixed(1)}m — you'd be looking up by about ${diffCm}cm. It could rest its chin on your head!`,
      `At ${pokeHeightM.toFixed(1)}m vs your ${userM.toFixed(2)}m, ${name} has ${diffCm}cm on you. You'd feel like a kid standing next to it.`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio > 1.1) {
    const msgs = [
      `${name} (${pokeHeightM.toFixed(1)}m) is just a tad taller than you — only ${diffCm}cm more. Almost eye level!`,
      `You're close in height! ${name} edges you out by just ${diffCm}cm at ${pokeHeightM.toFixed(1)}m. A friendly rival size.`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio >= 0.9) {
    const msgs = [
      `You and ${name} are practically the same height! At ${pokeHeightM.toFixed(1)}m, you'd see perfectly eye-to-eye. High-five material!`,
      `${name} is ${pokeHeightM.toFixed(1)}m and you're ${userM.toFixed(2)}m — only ${diffCm}cm apart. The perfect partner size.`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio > 0.5) {
    const msgs = [
      `At ${pokeHeightM.toFixed(1)}m, ${name} comes up to around your waist. It's ${diffCm}cm shorter — a perfect companion to walk beside.`,
      `${name} is a comfortable ${pokeHeightM.toFixed(1)}m. You'd look down at it by ${diffCm}cm. Great size for head-pats!`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (ratio > 0.2) {
    const msgs = [
      `${name} is tiny at ${pokeHeightM.toFixed(1)}m! It would barely reach your knees — ${diffCm}cm shorter. You'd need to crouch to say hello.`,
      `Only ${pokeHeightM.toFixed(1)}m tall, ${name} could comfortably sit on your lap. It's ${diffCm}cm shorter than you!`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else {
    const msgs = [
      `${name} is incredibly tiny at just ${(pokeHeightM * 100).toFixed(0)}cm! It could sit on your palm or perch on your shoulder. ${diffCm}cm smaller!`,
      `At only ${(pokeHeightM * 100).toFixed(0)}cm, ${name} is pocket-sized! Be careful not to step on it — you're ${diffCm}cm taller!`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

export default function About({ pokemon }: { pokemon: PokemonDetail }) {
  const [showCompare, setShowCompare] = useState(false);
  const [userHeight, setUserHeight] = useState("170");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pokeHeightM = pokemon.height / 10;
  const pokeWeightKg = pokemon.weight / 10;

  const handleCompare = () => {
    const h = parseFloat(userHeight);
    if (isNaN(h) || h <= 0) return;
    setMessage(getComparisonMessage(h, pokemon.name, pokeHeightM));
  };

  const handleShare = async () => {
    if (!message) return;
    const name = formatName(pokemon.name).replace(/<[^>]*>/g, '');
    const text = `🔎 How tall is ${name} compared to me?\n\n${message}\n\n#Pokedex`;
    
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
            <div className="bg-muted/30 rounded-2xl border border-border/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Your height</label>
                <div className="flex items-center gap-1 flex-1">
                  <input 
                    type="number"
                    value={userHeight}
                    onChange={(e) => setUserHeight(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                    className="w-20 bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm font-semibold text-right focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="170"
                  />
                  <span className="text-xs text-muted-foreground font-medium">cm</span>
                </div>
                <button
                  onClick={handleCompare}
                  className="px-3 py-1.5 text-xs font-bold bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  Go
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-start justify-between gap-3"
                  >
                    <p className="text-sm leading-relaxed italic text-muted-foreground flex-1">
                      "{message}"
                    </p>
                    <button
                      onClick={handleShare}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title={copied ? "Copied!" : "Share comparison"}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
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
