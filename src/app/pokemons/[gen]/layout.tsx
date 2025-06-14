import { ReactNode } from "react";
import GenSelect from "../_components/gen-select";
import SearchPokemon from "../_components/search-pokemon";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PokemonsLayout({
  children,
  details
}: { 
  children: ReactNode;
  details: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <aside className="w-1/2 space-y-2">
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

      <article className="w-1/2 flex-grow p-4 border shadow-inner rounded-lg h-[calc(100vh-120px)]">
        {details}
      </article>
    </div>
  );
}