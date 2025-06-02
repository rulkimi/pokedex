import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GenSelect from "../_components/gen-select";
import SearchPokemon from "../_components/search-pokemon";

export default function PokemonsLayout({ children }: { children: ReactNode }) {
  
  return (
    <div className="font-mono container space-y-4 mx-auto p-8 px-4 lg:px-27 xl:px-56">
      <div className="flex gap-1">
        <SearchPokemon />
        <GenSelect />
      </div>
      <ScrollArea className="h-[calc(100vh-140px)]">
        {children}
      </ScrollArea>
    </div>
  );
}