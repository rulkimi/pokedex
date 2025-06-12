"use client"

import { createContext, useContext, useState, ReactNode } from "react";

type SpriteType = "default" | "artwork";

interface SpriteContextType {
	spriteType: SpriteType;
	setSpriteType: (type: SpriteType) => void;
}

const SpriteContext = createContext<SpriteContextType | undefined>(undefined);

export function SpriteProvider({ children }: { children: ReactNode }) {
	const [spriteType, setSpriteType] = useState<SpriteType>("default");

	return (
		<SpriteContext.Provider value={{ spriteType, setSpriteType }}>
			{children}
		</SpriteContext.Provider>
	);
}

export function useSprite() {
	const context = useContext(SpriteContext);
	if (context === undefined) {
		throw new Error("useSprite must be used within a SpriteProvider");
	}
	return context;
}
