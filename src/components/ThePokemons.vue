<template>
  <div class="max-h-[calc(100vh-100px)] overflow-y-auto">
    <div class="sticky top-0 z-10 bg-white w-full">
      <div class="inline-block text-left w-full">
        <select v-model="selectedGeneration" @change="getPokemons(selectedGeneration)" class="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-gray-500">
          <option v-for="(n, index) in 9" :key="index" :value="index + 1">{{ `Generation ${n}` }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6z"/></svg>
        </div>
      </div>
    </div>
    <ul class="mt-4">
      <PokeList
        v-for="(pokemon, index) in pokemons"
        :key="pokemon.name"
        :index="index + 1 + generationLimits[selectedGeneration].offset"
        :name="pokemon.name"
        :types="pokemon.types"
        :picture="pokemon.image"
        @click="pokemonDetail(index + 1 + generationLimits[selectedGeneration].offset)"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import PokeList from './PokeList.vue';

const pokemons = ref([]);
const emit = defineEmits(['pokemonDetailsFetched']);
const selectedGeneration = ref(1);

const generationLimits = ref({
  1: { limit: 151, offset: 0 }, // Generation 1
  2: { limit: 100, offset: 151 }, // Generation 2
  3: { limit: 135, offset: 251 }, // Generation 3
  4: { limit: 107, offset: 386 }, // Generation 4
  5: { limit: 156, offset: 493 }, // Generation 5
  6: { limit: 72, offset: 649 }, // Generation 6
  7: { limit: 88, offset: 721 }, // Generation 7
  8: { limit: 96, offset: 809 }, // Generation 8
  9: { limit: 120, offset: 905 }, // Generation 8
});

onMounted(() => {
  getPokemons(selectedGeneration.value);
});

const getPokemons = async (generation) => {
  try {
    const cachedPokemons = localStorage.getItem(`pokemons-gen-${generation}`);
    if (cachedPokemons) {
      pokemons.value = JSON.parse(cachedPokemons);
      return;
    }

    const { limit, offset } = generationLimits.value[generation];

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const responseData = await response.json();
    const pokemonsData = responseData.results;

    const pokemonDetailsPromises = pokemonsData.map(async (pokemonData) => {
      const pokemonResponse = await fetch(pokemonData.url);
      if (!pokemonResponse.ok) {
        throw new Error('Failed to fetch Pokémon details');
      }
      const pokemonDetails = await pokemonResponse.json();
      const pokemonTypes = pokemonDetails.types.map(detail => detail.type.name);
      return {
        name: pokemonData.name,
        url: pokemonData.url,
        image: pokemonDetails.sprites.front_default,
        types: pokemonTypes,
      };
    });

    const resolvedPokemons = await Promise.all(pokemonDetailsPromises);
    pokemons.value = resolvedPokemons;

    localStorage.setItem(`pokemons-gen-${generation}`, JSON.stringify(resolvedPokemons));
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

    emit('pokemonDetailsFetched', responseData);

  } catch (error) {
    console.error(error);
  }
}
</script>
