"use client";

import { useSprite } from "../[gen]/sprite-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const SPRITE_TYPE_KEY = "pokemon-sprite-type";

export default function TopNav() {
  const { setSpriteType } = useSprite();
  const [defaultValue, setDefaultValue] = useState<"default" | "artwork" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SPRITE_TYPE_KEY) as "default" | "artwork" | null;
    const initial = saved ?? "default";
    setDefaultValue(initial);
    setSpriteType(initial);
  }, [setSpriteType]);

  const handleSpriteChange = (value: string) => {
    const newValue = value as "default" | "artwork";
    setSpriteType(newValue);
    localStorage.setItem(SPRITE_TYPE_KEY, newValue);
  };

  if (defaultValue === null) return null; // prevent hydration mismatch

  return (
    <nav className="flex justify-end mb-4">
      <Tabs defaultValue={defaultValue} onValueChange={handleSpriteChange}>
        <TabsList>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
}
