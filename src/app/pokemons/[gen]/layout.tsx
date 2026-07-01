"use client"

import { ReactNode } from "react";
import GenSelect from "../_components/gen-select";
import SearchPokemon from "../_components/search-pokemon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDetailsMobileView } from "../details-mobile-view-provider";
import { useViewport } from "@/hooks/use-viewport";
import { motion, AnimatePresence, useDragControls } from "motion/react";

export default function PokemonsLayout({
  children,
  details
}: { 
  children: ReactNode;
  details: ReactNode;
}) {
  const { isMobile } = useViewport();
  const { isOpen, setIsOpen } = useDetailsMobileView();
  const dragControls = useDragControls();

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
        <ScrollArea className="h-[calc(100dvh-240px)]">
          {children}
        </ScrollArea>
      </aside>

      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="fixed inset-0 z-50 bg-background top-20 border shadow-md rounded-t-4xl overflow-hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              dragListener={false}
              dragControls={dragControls}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setIsOpen(false);
                }
              }}
            >
              <div 
                className="w-full h-10 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 z-50"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-foreground/20 rounded-full" />
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto touch-pan-y overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <article className="w-1/2 flex-grow h-[calc(100dvh-190px)] rounded-3xl border overflow-hidden bg-background">
          <div className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {details}
          </div>
        </article>
      )}
    </div>
  );
}