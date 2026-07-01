import { 
  Leaf, Flame, Droplets, Zap, Bug, Skull, CircleDot, Snowflake, 
  Mountain, Swords, Feather, Eye, Hexagon, Ghost, Moon, Shield, 
  Sparkles, Crown, Circle
} from "lucide-react";

export const TypeIconMap: Record<string, React.ElementType> = {
  grass: Leaf,
  fire: Flame,
  water: Droplets,
  electric: Zap,
  bug: Bug,
  poison: Skull,
  normal: CircleDot,
  ice: Snowflake,
  ground: Mountain,
  fighting: Swords,
  flying: Feather,
  psychic: Eye,
  rock: Hexagon,
  ghost: Ghost,
  dragon: Crown,
  dark: Moon,
  steel: Shield,
  fairy: Sparkles
};

export const TypeBackgrounds = ({ types }: { types: string[] }) => {
  const Icon1 = TypeIconMap[types[0]] || Circle;
  const Icon2 = types.length > 1 ? (TypeIconMap[types[1]] || Circle) : null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15] text-white">
      {Icon2 ? (
        <>
          <Icon1 className="absolute w-56 h-56 -right-12 -top-4 rotate-12" strokeWidth={1.5} />
          <Icon2 className="absolute w-48 h-48 right-20 top-16 -rotate-12 opacity-80" strokeWidth={1.5} />
        </>
      ) : (
        <Icon1 className="absolute w-72 h-72 -right-16 -top-4 rotate-12" strokeWidth={1.5} />
      )}
    </div>
  );
};
