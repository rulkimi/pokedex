import { ReactNode } from "react";
import GenSelect from "../_components/gen-select";
import SearchPokemon from "../_components/search-pokemon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpriteProvider } from "./sprite-provider";
import TopNav from "../_components/top-nav";

export default function PokemonsLayout({
  children,
  details
}: { 
  children: ReactNode;
  details: ReactNode;
}) {
  return (
    <main className="font-mono container space-y-4 mx-auto p-8 px-4 lg:px-27 xl:px-56">
      <SpriteProvider>
        <TopNav />
        <div className="flex gap-4">
          <div className="w-1/2 space-y-2">
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
          </div>

          <div className="w-1/2 flex-grow p-4 border shadow-inner rounded-lg h-[calc(100vh-120px)]">
            {details}
          </div>
        </div>
      </SpriteProvider>
    </main>
  );
}