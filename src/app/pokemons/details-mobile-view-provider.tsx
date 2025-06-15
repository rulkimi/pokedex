"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface DetailsMobileViewContextType {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const DetailsMobileViewContext = createContext<DetailsMobileViewContextType | undefined>(undefined);

export function DetailsMobileViewProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DetailsMobileViewContext.Provider value={{ isOpen, setIsOpen }}>
			{children}
		</DetailsMobileViewContext.Provider>
	);
}

export function useDetailsMobileView() {
	const context = useContext(DetailsMobileViewContext);
	if (context === undefined) {
		throw new Error("useDetailsMobileView must be used within a DetailsMobileViewProvider");
	}
	return context;
}
