"use client";

import { useSprite } from "../sprite-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useViewport } from "@/hooks/use-viewport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const SPRITE_TYPE_KEY = "pokemon-sprite-type";

export default function TopNav() {
  const { isMobile } = useViewport();
  const { setSpriteType } = useSprite();
  const router = useRouter();
  const pathname = usePathname();

  const [defaultSprite, setDefaultSprite] = useState<
    "default" | "artwork" | "home" | "showdown" | null
  >(null);
  const [defaultRoute, setDefaultRoute] = useState<"pokedex" | "guess">(
    "pokedex"
  );
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const saved = localStorage.getItem(SPRITE_TYPE_KEY) as
      | "default"
      | "artwork"
      | "home"
      | "showdown"
      | null;
    const initial = saved ?? "default";
    setDefaultSprite(initial);
    setSpriteType(initial);

    // Set initial route based on current pathname
    if (pathname.includes("/guess")) {
      setDefaultRoute("guess");
    } else {
      setDefaultRoute("pokedex");
    }

    // Reset pending route when navigation completes
    setPendingRoute(null);

    // Prefetch routes in background for instant navigation
    router.prefetch("/pokemons/1/0");
    router.prefetch("/pokemons/guess");
  }, [setSpriteType, pathname, router]);

  const handleSpriteChange = (value: string) => {
    const newValue = value as "default" | "artwork" | "home" | "showdown";
    setSpriteType(newValue);
    localStorage.setItem(SPRITE_TYPE_KEY, newValue);
  };

  const handleRouteChange = (value: string) => {
    if (value === defaultRoute) return;
    setPendingRoute(value);
    startTransition(() => {
      if (value === "pokedex") {
        router.push("/pokemons/1/0");
      } else if (value === "guess") {
        router.push("/pokemons/guess");
      }
    });
  };

  if (defaultSprite === null) return null; // prevent hydration mismatch

  return (
    <nav className="flex justify-between mb-4">
      <Tabs value={defaultRoute} onValueChange={handleRouteChange}>
        <TabsList>
          <TabsTrigger value="pokedex" disabled={isPending}>
            {isPending && pendingRoute === "pokedex" && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            Pokédex
          </TabsTrigger>
          <TabsTrigger value="guess" disabled={isPending}>
            {isPending && pendingRoute === "guess" && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            Guess
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {isMobile ? (
        <div className="flex items-center gap-2">
          {/* <Label>Sprite:</Label> */}
          <Select
            defaultValue={defaultSprite}
            onValueChange={handleSpriteChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="artwork">Artwork</SelectItem>
              <SelectItem value="home">3D (HOME)</SelectItem>
              {/* <SelectItem value="showdown">Animated</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <RadioGroup
          className="flex gap-2"
          defaultValue={defaultSprite}
          onValueChange={handleSpriteChange}
        >
          <Label className="mr-2 hidden lg:block self-center">Sprite: </Label>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="sprite-default" />
            <Label htmlFor="sprite-default">Default</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="artwork" id="sprite-artwork" />
            <Label htmlFor="sprite-artwork">Artwork</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="home" id="sprite-home" />
            <Label htmlFor="sprite-home">3D</Label>
          </div>
          {/* <div className="flex items-center gap-3">
            <RadioGroupItem value="showdown" id="sprite-showdown" />
            <Label htmlFor="sprite-showdown">Animated</Label>
          </div> */}
        </RadioGroup>
      )}
    </nav>
  );
}
