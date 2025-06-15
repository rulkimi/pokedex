"use client"

import { ReactNode } from "react";
import GenSelect from "../_components/gen-select";
import SearchPokemon from "../_components/search-pokemon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDetailsMobileView } from "../details-mobile-view-provider";
import { useViewport } from "@/hooks/use-viewport";
import { motion, AnimatePresence } from "motion/react";

export default function PokemonsLayout({
  children,
  details
}: { 
  children: ReactNode;
  details: ReactNode;
}) {
  const { isMobile } = useViewport();
  const { isOpen, setIsOpen } = useDetailsMobileView();

  return (
    <div className={`relative flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
      <aside className={`${isMobile ? 'w-full' : 'w-1/2'} space-y-2`}>
        <div className="flex gap-1">
          <div className="w-2/3">
            <SearchPokemon />
          </div>
          <div className="w-1/3">
            <GenSelect />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-160px)]">
          {children}
        </ScrollArea>
      </aside>

      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="fixed inset-0 z-50 bg-white top-18 border shadow-md rounded-t-4xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4">
                <button 
                  className="mb-4 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  ← Back
                </button>
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ): (
        <article className="w-1/2 flex-grow p-4 border shadow-inner rounded-lg h-[calc(100vh-120px)]">
          {details}
        </article>
      )}
    </div>
  );
}