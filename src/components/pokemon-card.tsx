import { Pokemon } from "@/app/pokemons/[gen]/actions";
import { formatId, getTypeColor, capitalizeFirstLetter, getArrangedTypes } from "@/utils";
import Image from "next/image";

interface PokemomCardProps {
  pokemon: Pokemon;
  onClick: (pokemonId: number) => void;
}

const IMAGE_SIZE = 80;

export default function PokemonCard({
  pokemon,
  onClick
}: PokemomCardProps ) {
  const pokemonTypes = getArrangedTypes(pokemon.types);

  return (
    <div
      className={`
        hover:${getTypeColor(pokemonTypes[0])}/20
        flex items-center justify-between gap-2 px-4 border border-transparent dark:border-slate-800 rounded-2xl group cursor-pointer`
      }
      onClick={() => onClick(pokemon.id)}
    >
      <div className="space-y-2">
        <Header
          id={pokemon.id}
          name={pokemon.name}
        />
        <Types types={pokemonTypes} />
      </div>
      <Image
        src={pokemon.image}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        alt={`Front image of ${pokemon.name}`}
        className="group-hover:scale-150 group-hover:rotate-6 transition-transform duration-500"
        loading="lazy"
        // placeholder="blur"
        // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
      />
    </div>
  );
}

const Header = ({
  id, 
  name 
}: {
  id: number;
  name: string;
} ) => {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">{formatId(id)}</span>
      <span className="font-semibold">{capitalizeFirstLetter(name)}</span>
    </div>
  );
}

const Types = ({ types }: { types: Pokemon["types"] }) => {
  return (
    <ul className="flex gap-1 text-sm">
      {types.map((type, index) => (
        <li
          key={index}
          className={`${getTypeColor(type)} px-2 py-0.5 rounded-2xl text-white`}
        >
          {type}
        </li>
      ))}
    </ul>
  );
}