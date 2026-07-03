"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Image as ImageIcon, Link as LinkIcon, Loader2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PokemonDetail } from "../../../actions";
import { toPng } from "html-to-image";
import { formatName, getArrangedTypes, getTypeColor, formatId } from "@/lib/utils";
import PokemonImage from "../../../_components/pokemon-image";

export default function SharePokemon({ pokemon }: { pokemon: PokemonDetail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const arrangedTypes = getArrangedTypes(pokemon.types);
  const primaryColorClass = getTypeColor(arrangedTypes[0]);

  const handleShareLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${formatName(pokemon.name)}!`,
          url: url
        });
        return;
      } catch (err) {}
    }
    
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // html-to-image is much better at rendering modern CSS (z-index, flex, grids)
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#020817', // Match the dark background
        style: {
          transform: 'none', // Prevent visual scaling from affecting the render
        }
      });
      
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      const file = new File([blob], `${pokemon.name}-stats.png`, { type: 'image/png' });
      
      let shared = false;
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${formatName(pokemon.name)} Stats`,
            text: `Check out ${formatName(pokemon.name)}'s stats! #PokédexByrulkimi`
          });
          shared = true;
        } catch (e) {}
      }
      
      if (!shared) {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${pokemon.name}-stats.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to generate or share image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-10 w-10 shrink-0">
          <Share2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl bg-transparent border-none shadow-none overflow-visible p-0 flex flex-col items-center justify-center gap-6 outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Share {formatName(pokemon.name)}</DialogTitle>
        </DialogHeader>
        
        {/* Scaled wrapper for preview */}
        <div className="flex justify-center w-full relative z-10 h-[216px] sm:h-[288px] md:h-[408px]">
          <div className="origin-top shrink-0 scale-[0.45] sm:scale-[0.6] md:scale-[0.85]" style={{ width: '850px', height: '480px' }}>
            
            {/* Horizontal Card Design */}
            <div 
              ref={cardRef} 
              className="w-[850px] h-[480px] overflow-hidden rounded-[2.5rem] bg-background shadow-2xl flex relative z-10 border border-white/10"
            >
              {/* Left Panel - Theme Color & Image */}
              <div className={`w-[340px] relative ${primaryColorClass} p-7 flex flex-col shrink-0`}>
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="absolute -right-16 top-10 w-[120%] h-[120%] opacity-[0.12] text-white rotate-12 pointer-events-none">
                    <circle cx="50" cy="50" r="40" />
                    <circle cx="50" cy="50" r="12" />
                    <path d="M10 50 H38" />
                    <path d="M62 50 H90" />
                  </svg>

                  <div className="z-10 text-white/90">
                    <div className="flex justify-between items-start w-full">
                       <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md capitalize max-w-[200px] leading-none" dangerouslySetInnerHTML={{ __html: formatName(pokemon.name) }} />
                       <span className="text-2xl font-bold opacity-70 drop-shadow-md">{formatId(pokemon.id)}</span>
                    </div>
                    
                    <div className="flex gap-1.5 mt-3">
                      {arrangedTypes.map((type, index) => (
                        <span
                          key={index}
                          className="bg-white/25 border border-white/40 px-3 py-1 rounded-full text-white text-xs font-bold tracking-widest uppercase shadow-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-4 text-white/90 text-[11px] font-extrabold uppercase tracking-widest drop-shadow-sm">
                      <span className="flex gap-1.5 items-baseline">
                        <span className="opacity-70 text-[9px]">HT</span>
                        {(pokemon.height / 10).toFixed(1)}m
                      </span>
                      <span className="opacity-40">|</span>
                      <span className="flex gap-1.5 items-baseline">
                        <span className="opacity-70 text-[9px]">WT</span>
                        {(pokemon.weight / 10).toFixed(1)}kg
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center z-20 my-2">
                     <PokemonImage pokemonId={pokemon.id} alt={pokemon.name} imageSize={300} className="w-56 h-56 object-contain drop-shadow-2xl" />
                  </div>
                  
                  <div className="z-10 text-white/70 font-medium tracking-widest text-[10px] uppercase">
                     Pokédex by rulkimi
                  </div>
                </div>
                
                {/* Right Panel - Stats & Data */}
                <div className="flex-1 bg-background/95 p-6 flex flex-col gap-4 z-10 relative overflow-hidden">
                  
                  {/* Description */}
                  {pokemon.description && (
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 italic">
                      &ldquo;{pokemon.description}&rdquo;
                    </p>
                  )}

                  {/* Abilities */}
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    <span className="font-bold uppercase tracking-widest text-[9px] mr-2">Abilities</span>
                    <span className="font-semibold text-foreground/80">
                      {pokemon.abilities.map((a) => {
                        const formattedName = a.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        return `${formattedName}${a.is_hidden ? ' (H)' : ''}`;
                      }).join(', ')}
                    </span>
                  </div>

                  {/* Base Stats Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Base Stats</h4>
                      <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Total</span>
                        <span className="text-primary font-extrabold text-[11px]">{pokemon.stats.reduce((sum: number, stat: {value: number}) => sum + stat.value, 0)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                      {pokemon.stats.map(stat => {
                        const statNameMap: Record<string, string> = {
                          'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
                          'special-attack': 'SATK', 'special-defense': 'SDEF', 'speed': 'SPD'
                        };
                        const shortName = statNameMap[stat.name] || stat.name;
                        const percentage = Math.min(100, (stat.value / 150) * 100);
                        
                        return (
                          <div key={stat.name} className="flex items-center text-xs">
                            <span className="w-9 font-bold text-muted-foreground text-[10px]">{shortName}</span>
                            <span className="w-7 text-right font-bold mr-2 text-[11px]">{stat.value}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 justify-between gap-3 mt-1">
                    {/* Type Matchups Section */}
                    {pokemon.damageRelations && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {pokemon.damageRelations.weaknesses && pokemon.damageRelations.weaknesses.length > 0 && (
                          <div className="flex flex-col">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Weak To</h4>
                            <div className="flex flex-wrap gap-1">
                              {pokemon.damageRelations.weaknesses.slice(0, 5).map((w: {type: string, multiplier: number}, i: number) => (
                                <span key={i} className={`${getTypeColor(w.type)} px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1`}>
                                  <span>{w.type}</span>
                                  {w.multiplier > 1 && <span className="bg-black/20 rounded-[4px] px-1">{w.multiplier}x</span>}
                                </span>
                              ))}
                              {pokemon.damageRelations.weaknesses.length > 5 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[9px] font-bold tracking-wider">
                                  +{pokemon.damageRelations.weaknesses.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {pokemon.damageRelations.resistances && pokemon.damageRelations.resistances.length > 0 && (
                          <div className="flex flex-col">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Resists</h4>
                            <div className="flex flex-wrap gap-1">
                              {pokemon.damageRelations.resistances.slice(0, 5).map((r: {type: string, multiplier: number}, i: number) => (
                                <span key={i} className={`${getTypeColor(r.type)} px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1`}>
                                  <span>{r.type}</span>
                                  <span className="bg-black/20 rounded-[4px] px-1">{r.multiplier}x</span>
                                </span>
                              ))}
                              {pokemon.damageRelations.resistances.length > 5 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[9px] font-bold tracking-wider">
                                  +{pokemon.damageRelations.resistances.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {pokemon.damageRelations.strengths && pokemon.damageRelations.strengths.length > 0 && (
                          <div className="flex flex-col col-span-2">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">STAB Strong Against</h4>
                            <div className="flex flex-wrap gap-1">
                              {pokemon.damageRelations.strengths.slice(0, 10).map((type: string, i: number) => (
                                <span key={i} className={`${getTypeColor(type)} px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold tracking-wider uppercase`}>
                                  {type}
                                </span>
                              ))}
                              {pokemon.damageRelations.strengths.length > 10 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[9px] font-bold tracking-wider">
                                  +{pokemon.damageRelations.strengths.length - 10}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evolutions & Variants */}
                    {(() => {
                      const hasEvolutions = pokemon.evolutions && pokemon.evolutions.length > 1;
                      const actualVariants = pokemon.variants ? pokemon.variants.filter(v => v.id !== pokemon.speciesId) : [];
                      const hasVariants = actualVariants.length > 0;
                      const totalCount = (hasEvolutions ? pokemon.evolutions.length : 0) + actualVariants.length;
                      
                      if (!hasEvolutions && !hasVariants) return null;
                      
                      const renderEvolution = (ev: any) => (
                        <div key={`ev-${ev.id}`} className="bg-muted/30 rounded-full p-0.5 border border-border/50">
                          <PokemonImage pokemonId={ev.id} fallbackPokemonId={ev.id} imageSize={40} className="w-7 h-7 object-contain drop-shadow-sm" alt={ev.name} />
                        </div>
                      );
                      
                      const renderVariant = (v: any) => (
                        <div key={`var-${v.id}`} className="bg-muted/30 rounded-full p-0.5 border border-border/50">
                          <PokemonImage pokemonId={v.id} fallbackPokemonId={pokemon.speciesId} imageSize={40} className="w-7 h-7 object-contain drop-shadow-sm" alt={v.name} />
                        </div>
                      );

                      if (totalCount > 10 && hasEvolutions && hasVariants) {
                        return (
                          <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5 w-full">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Family & Variants</h4>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {pokemon.evolutions.map(renderEvolution)}
                              {actualVariants.map(renderVariant)}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="pt-2 border-t border-border/50 flex flex-wrap justify-between gap-4">
                          {hasEvolutions && (
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Evolution Line</h4>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {pokemon.evolutions.map(renderEvolution)}
                              </div>
                            </div>
                          )}
                          
                          {hasVariants && (
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 text-right">Variants</h4>
                              <div className="flex flex-wrap items-center justify-end gap-1.5">
                                {actualVariants.map(renderVariant)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        
          <div className="flex gap-4 w-full max-w-sm px-4">
          <Button onClick={handleShareImage} disabled={isGenerating} className="flex-1 rounded-full h-14 font-bold shadow-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white transition-all">
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-2" />}
            {isGenerating ? "Saving..." : "Save Image"}
          </Button>
          <Button onClick={handleShareLink} className="flex-1 rounded-full h-14 font-bold shadow-xl bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white transition-all">
            {copiedLink ? <Check className="w-5 h-5 mr-2 text-green-400" /> : <LinkIcon className="w-5 h-5 mr-2" />}
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
