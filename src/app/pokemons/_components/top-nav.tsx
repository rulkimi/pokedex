"use client";

import { useSprite } from "../[gen]/sprite-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SPRITE_TYPE_KEY = "pokemon-sprite-type";

export default function TopNav() {
  const { setSpriteType } = useSprite();
  const router = useRouter();

  const [defaultSprite, setDefaultSprite] = useState<"default" | "artwork" | null>(null);
  const [defaultRoute, setDefaultRoute] = useState<"pokedex" | "guess">("pokedex");

  useEffect(() => {
    const saved = localStorage.getItem(SPRITE_TYPE_KEY) as "default" | "artwork" | null;
    const initial = saved ?? "default";
    setDefaultSprite(initial);
    setSpriteType(initial);
  }, [setSpriteType]);

  const handleSpriteChange = (value: string) => {
    const newValue = value as "default" | "artwork";
    setSpriteType(newValue);
    localStorage.setItem(SPRITE_TYPE_KEY, newValue);
  };

  const handleRouteChange = (value: string) => {
    if (value === "pokedex") {
      router.push('/pokemons')
    } else if (value === "guess") {
      router.push('/pokemons/guess')
    }
  }

  if (defaultSprite === null) return null; // prevent hydration mismatch

  return (
    <nav className="flex justify-between mb-4">
      <Tabs defaultValue={defaultRoute} onValueChange={handleRouteChange}>
        <TabsList>
          <TabsTrigger value="pokedex">Pokedex</TabsTrigger>
          <TabsTrigger value="guess">Guess</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue={defaultSprite} onValueChange={handleSpriteChange}>
        <TabsList>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
}
