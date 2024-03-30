<template>
  <div>
    <div
      class="cursor-pointer inline-flex"
      :class="[backgroundColor(pokemon.type)]"
      v-for="(pokemon, index) in pokemons" 
      :key="pokemon.name"
      @click="pokemonDetail(index + 1)"
    >
      <div>
        <img :src="pokemon.image" :alt="pokemon.name + ' picture.'" class="mt-2">
        <span class="text-gray-400">{{ '#' + formatIndex(index + 1) }}</span>
        <div v-html="formatName(pokemon.name)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { formatIndex, formatName } from '../utils/formatHelper';

const pokemons = ref([]);

onMounted(() => {
  getPokemons();
  console.log(pokemons)
});

const backgroundColor = pokemonType => {
  let bgClass = '';

  switch (pokemonType) {
    case 'normal':
      bgClass = 'bg-gray-300'; // Normal type background color
      break;
    case 'fighting':
      bgClass = 'bg-red-600'; // Fighting type background color
      break;
    case 'flying':
      bgClass = 'bg-blue-300'; // Flying type background color
      break;
    case 'poison':
      bgClass = 'bg-purple-600'; // Poison type background color
      break;
    case 'ground':
      bgClass = 'bg-yellow-700'; // Ground type background color
      break;
    case 'rock':
      bgClass = 'bg-gray-700'; // Rock type background color
      break;
    case 'bug':
      bgClass = 'bg-green-500'; // Bug type background color
      break;
    case 'ghost':
      bgClass = 'bg-indigo-700'; // Ghost type background color
      break;
    case 'steel':
      bgClass = 'bg-gray-400'; // Steel type background color
      break;
    case 'fire':
      bgClass = 'bg-red-500'; // Fire type background color
      break;
    case 'water':
      bgClass = 'bg-blue-500'; // Water type background color
      break;
    case 'grass':
      bgClass = 'bg-green-500'; // Grass type background color
      break;
    case 'electric':
      bgClass = 'bg-yellow-400'; // Electric type background color
      break;
    case 'psychic':
      bgClass = 'bg-purple-500'; // Psychic type background color
      break;
    case 'ice':
      bgClass = 'bg-blue-200'; // Ice type background color
      break;
    case 'dragon':
      bgClass = 'bg-indigo-500'; // Dragon type background color
      break;
    case 'dark':
      bgClass = 'bg-gray-800'; // Dark type background color
      break;
    case 'fairy':
      bgClass = 'bg-pink-300'; // Fairy type background color
      break;
    // Add more cases for other Pokémon types and their corresponding background colors
    default:
      bgClass = 'bg-gray-300'; // Default background color
  }

  return bgClass;
};

const getPokemons = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const responseData = await response.json();
    const pokemonsData = responseData.results;

    // Fetch details for each Pokémon and get the image URL
    const pokemonDetailsPromises = pokemonsData.map(async (pokemonData) => {
      const pokemonResponse = await fetch(pokemonData.url);
      if (!pokemonResponse.ok) {
        throw new Error('Failed to fetch Pokémon details');
      }
      const pokemonDetails = await pokemonResponse.json();
      const type = pokemonDetails.types[1]?.type.name === 'flying' ? pokemonDetails.types[1]?.type.name : pokemonDetails.types[0]?.type.name;
      return {
        name: pokemonData.name,
        url: pokemonData.url,
        image: pokemonDetails.sprites.front_default,
        type: type
      };
    });

    const resolvedPokemons = await Promise.all(pokemonDetailsPromises);
    pokemons.value = resolvedPokemons;

  } catch (error) {
    console.error(error);
  }
}

const pokemonDetail = async (index) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const responseData = await response.json();
    const pokemonIndex = pokemons.value.findIndex(pokemon => pokemon.name === responseData.name);
    if (pokemonIndex !== -1) {
      pokemons.value[pokemonIndex].image = responseData.sprites.front_default;
    }

    console.log(responseData)

  } catch (error) {
    console.error(error);
  }
}
</script>
