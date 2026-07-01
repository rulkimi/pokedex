"use client";

import { DamageRelations } from "../../../actions";
import { getTypeColor } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export default function TypeMatchups({
  damageRelations
}: {
  damageRelations?: DamageRelations;
}) {
  if (!damageRelations) return null;

  const { weaknesses, resistances, strengths } = damageRelations;

  const renderBadge = (type: string, multiplier?: number) => {
    return (
      <div key={type} className={`px-2.5 py-0.5 rounded-2xl text-[13px] text-white capitalize flex items-center gap-1.5 ${getTypeColor(type)}`}>
        <span>{type}</span>
        {multiplier !== undefined && (
          <span className="bg-black/20 rounded-xl px-1.5 text-[11px] font-medium">{multiplier}x</span>
        )}
      </div>
    );
  };

  const getMultiplier = (type: string) => {
    const weak = weaknesses.find(w => w.type === type);
    if (weak) return weak.multiplier;
    const resist = resistances.find(r => r.type === type);
    if (resist) return resist.multiplier;
    return 1;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Type Matchups</h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Type Matchup Map</DialogTitle>
              <DialogDescription>
                How much damage this Pokémon takes from all 18 types.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {ALL_TYPES.map(type => {
                const multiplier = getMultiplier(type);
                return (
                  <div key={type} className={`px-2.5 py-1.5 rounded-2xl text-xs text-white capitalize flex items-center justify-between ${getTypeColor(type)} ${multiplier === 1 ? 'opacity-40 grayscale' : ''}`}>
                    <span>{type}</span>
                    <span className="bg-black/30 rounded-xl px-1.5 text-[11px] font-medium">{multiplier}x</span>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-2">Weak to</h4>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map(w => renderBadge(w.type, w.multiplier))}
            </div>
          </div>
        )}

        {resistances.length > 0 && (
          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-2">Resists</h4>
            <div className="flex flex-wrap gap-2">
              {resistances.map(r => renderBadge(r.type, r.multiplier))}
            </div>
          </div>
        )}

        {strengths.length > 0 && (
          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-2">STAB Strong Against</h4>
            <div className="flex flex-wrap gap-2">
              {strengths.map(type => renderBadge(type))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
