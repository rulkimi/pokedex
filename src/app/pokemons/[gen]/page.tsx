import { Suspense } from "react";
import PokemonsListing from "./_components/pokemons-listing";

interface PokemonsProps {
  params: Promise<{ gen: number }>;
}

export default async function Pokemons({
  params,
}: PokemonsProps) {
  const { gen } = await params;

  return (
    <Suspense  fallback={<div>Loading...</div>}>
      <PokemonsListing gen={gen} />
    </Suspense>
  );
}
