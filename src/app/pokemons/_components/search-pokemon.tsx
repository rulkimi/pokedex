"use client"

import { Input } from "@/components/ui/input";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { SlidersHorizontal, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getTypeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const ALL_TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice", 
  "fighting", "poison", "ground", "flying", "psychic", "bug", 
  "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

export default function SearchPokemon() {
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
		shallow: true
	});

  const [types, setTypes] = useQueryState("types", parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: true }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleType = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter((t) => t !== type).length > 0 ? types.filter((t) => t !== type) : null);
    } else {
      setTypes([...types, type]);
    }
  };

  let placeholderText = "Search pokémon...";
  if (types.length === 1) {
    placeholderText = `Search ${types[0]} pokémon...`;
  } else if (types.length > 1) {
    placeholderText = `Search ${types.length} selected types...`;
  }

	return (
    <div className="relative flex w-full items-center" ref={containerRef}>
      <Input 
        placeholder={placeholderText} 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pr-10"
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md transition-colors",
              types.length > 0 ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {types.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-sm">
                {types.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-4 rounded-xl shadow-xl border-border/40" 
          align="end" 
          sideOffset={8}
          style={{ width: containerWidth ? `${containerWidth}px` : 'auto' }}
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-sm tracking-tight">Filter by Type</h4>
                {types.length > 0 && (
                  <button 
                    onClick={() => setTypes(null)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.map((type) => {
                  const isSelected = types.includes(type);
                  const typeBg = getTypeColor(type as any);
                  
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={cn(
                        "flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize transition-colors duration-200 border",
                        isSelected 
                          ? `${typeBg} text-white border-transparent shadow-sm`
                          : "bg-transparent text-muted-foreground border-border/60 hover:border-foreground/30 hover:bg-muted"
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
	);
}