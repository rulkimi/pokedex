import { Suspense } from "react";
import PokemonsListing from "./_components/pokemons-listing";
import PokemonListingSkeleton from "./_components/pokemon-listing-skeleton";

interface PokemonsProps {
  params: Promise<{ gen: number }>;
}

export default async function Pokemons({
  params,
}: PokemonsProps) {
  const { gen } = await params;

  return (
    <Suspense fallback={<PokemonListingSkeleton />}>
      <PokemonsListing gen={gen} />
    </Suspense>
  );
}
