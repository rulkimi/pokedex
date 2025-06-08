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
  console.log('detaillsss', details)
  return (
    <main className="font-mono container space-y-4 mx-auto p-8 px-4 lg:px-27 xl:px-56">
      <div className="flex gap-4">
        <div className="space-y-2 w-1/2">
          <div className="flex gap-1">
            <SearchPokemon />
            <GenSelect />
          </div>
          <ScrollArea className="h-[calc(100vh-140px)]">
            {children}
          </ScrollArea>
        </div>
        <div className="w-1/2 flex-grow p-4 border shadow-inner rounded-lg h-[calc(100vh-100px)]">
          {details}
        </div>
      </div>
    </main>
  );
}