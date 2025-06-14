"use client";

import { useSprite } from "../[gen]/sprite-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui/radio-group";

const SPRITE_TYPE_KEY = "pokemon-sprite-type";

export default function TopNav() {
	const { setSpriteType } = useSprite();
	const router = useRouter();
	const pathname = usePathname();

	const [defaultSprite, setDefaultSprite] = useState<"default" | "artwork" | null>(null);
	const [defaultRoute, setDefaultRoute] = useState<"pokedex" | "guess">("pokedex");

	useEffect(() => {
		const saved = localStorage.getItem(SPRITE_TYPE_KEY) as "default" | "artwork" | null;
		const initial = saved ?? "default";
		setDefaultSprite(initial);
		setSpriteType(initial);

		// Set initial route based on current pathname
		if (pathname.includes('/guess')) {
			setDefaultRoute('guess');
		} else {
			setDefaultRoute('pokedex');
		}
	}, [setSpriteType, pathname]);

	const handleSpriteChange = (value: string) => {
		const newValue = value as "default" | "artwork";
		setSpriteType(newValue);
		localStorage.setItem(SPRITE_TYPE_KEY, newValue);
	};

	const handleRouteChange = (value: string) => {
		if (value === "pokedex") {
			router.push('/pokemons/1/0')
		} else if (value === "guess") {
			router.push('/pokemons/guess')
		}
	}

	if (defaultSprite === null) return null; // prevent hydration mismatch

	return (
		<nav className="flex justify-between mb-4">
			<Tabs defaultValue={defaultRoute} onValueChange={handleRouteChange}>
				<TabsList>
					<TabsTrigger value="pokedex">Pokédex</TabsTrigger>
					<TabsTrigger value="guess">Guess</TabsTrigger>
				</TabsList>
			</Tabs>
			<RadioGroup
        className="flex gap-2"
        defaultValue={defaultSprite}
        onValueChange={handleSpriteChange}
      >
        <Label className="mr-2">Sprite: </Label>
				<div className="flex items-center gap-3">
					<RadioGroupItem value="default" id="sprite-default" />
					<Label htmlFor="sprite-default">Default</Label>
				</div>
				<div className="flex items-center gap-3">
					<RadioGroupItem value="artwork" id="sprite-artwork" />
					<Label htmlFor="sprite-artwork">Artwork</Label>
				</div>
			</RadioGroup>
		</nav>
	);
}
