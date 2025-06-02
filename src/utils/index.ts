interface GenerationConfig {
	limit: number;
	offset: number;
}

const GENERATION_LIMITS: { [key: number]: GenerationConfig } = {
	1: { limit: 151, offset: 0 }, // Generation 1
	2: { limit: 100, offset: 151 }, // Generation 2
	3: { limit: 135, offset: 251 }, // Generation 3
	4: { limit: 107, offset: 386 }, // Generation 4
	5: { limit: 156, offset: 493 }, // Generation 5
	6: { limit: 72, offset: 649 }, // Generation 6
	7: { limit: 88, offset: 721 }, // Generation 7
	8: { limit: 96, offset: 809 }, // Generation 8
	9: { limit: 120, offset: 905 }, // Generation 9
};

export const getGeneration = (gen: number): GenerationConfig => {
	return GENERATION_LIMITS[gen];
}

export const formatId = (id: number) => {
  return `#${id.toString().padStart(3, '0')}`;
}

export const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const typeColors: { [key: string]: string } = {
	grass: 'bg-emerald-500',
	fire: 'bg-red-700',
	water: 'bg-blue-500',
	electric: 'bg-yellow-400',
	bug: 'bg-green-700',
	poison: 'bg-fuchsia-800',
	normal: 'bg-gray-400',
	ice: 'bg-cyan-300',
	ground: 'bg-yellow-900',
	fighting: 'bg-red-700',
	flying: 'bg-indigo-400',
	psychic: 'bg-pink-500',
	rock: 'bg-yellow-600',
	ghost: 'bg-indigo-700',
	dragon: 'bg-indigo-900',
	dark: 'bg-gray-800',
	steel: 'bg-gray-600',
	fairy: 'bg-pink-300'
};

type Type = keyof typeof typeColors;

export const getTypeColor = (pokemonType: Type) => {
	return typeColors[pokemonType] || 'gray-500';
};

export const getArrangedTypes = (types: string[]) => {
  const typesCopy = [...types];
  const normalIndex = typesCopy.indexOf('normal');

  if (normalIndex !== -1) {
    const normalElement = typesCopy.splice(normalIndex, 1)[0];
    typesCopy.push(normalElement);
  };

  return typesCopy;
};


