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

    <!-- pokemon list placeholder -->
    <ul v-if="loadPlaceholder" class="mt-4">
      <li v-for="n in 8" class="border border-gray-300 rounded-xl px-5 py-2 mb-2 flex items-center animate-pulse">
        <div class="flex flex-col mr-4">
          <div class="flex items-center">
            <div class="w-12 h-5 bg-gray-200 rounded-md mr-2"></div>
            <div class="w-32 h-5 bg-gray-200 rounded-md"></div>
          </div>
      
          <div class="flex flex-wrap mt-2">
            <div class="bg-gray-200 rounded-full text-white text-xs px-2 py-1 pb-1.5 mr-1 mb-1 w-14"></div>
            <div class="bg-gray-200 rounded-full text-white text-xs px-2 py-1 pb-1.5 mr-1 mb-1 w-14"></div>
            <div class="bg-gray-200 rounded-full text-white text-xs px-2 py-1 pb-1.5 mr-1 mb-1 w-14"></div>
          </div>
        </div>
      
        <div class="w-20 h-20 bg-gray-200 rounded-full ml-auto"></div>
      </li>
    </ul>

    <ul v-else class="mt-4">
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
import axios from 'axios';

const pokemons = ref([]);
const emit = defineEmits(['pokemon-details-fetched']);
const selectedGeneration = ref(1);
const loadPlaceholder = ref(false);

const generationLimits = ref({
  1: { limit: 151, offset: 0 }, // Generation 1
  2: { limit: 100, offset: 151 }, // Generation 2
  3: { limit: 135, offset: 251 }, // Generation 3
  4: { limit: 107, offset: 386 }, // Generation 4
  5: { limit: 156, offset: 493 }, // Generation 5
  6: { limit: 72, offset: 649 }, // Generation 6
  7: { limit: 88, offset: 721 }, // Generation 7
  8: { limit: 96, offset: 809 }, // Generation 8
  9: { limit: 120, offset: 905 }, // Generation 9
});

onMounted(() => {
  getPokemons(selectedGeneration.value);
});

const getPokemons = async (generation) => {
  loadPlaceholder.value = true;
  try {
    const cachedPokemons = localStorage.getItem(`pokemons-gen-${generation}`);
    if (cachedPokemons) {
      pokemons.value = JSON.parse(cachedPokemons);
      return;
    }

    const { limit, offset } = generationLimits.value[generation];

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

    const { data } = response;
    const pokemonsData = data.results;

    const pokemonDetailsPromises = pokemonsData.map(async (pokemonData) => {
      const pokemonResponse = await axios.get(pokemonData.url);
      const { data } = pokemonResponse;
      const pokemonTypes = data.types.map(detail => detail.type.name);
      return {
        name: pokemonData.name,
        url: pokemonData.url,
        image: data.sprites.front_default,
        types: pokemonTypes,
      };
    });

    const resolvedPokemons = await Promise.all(pokemonDetailsPromises);
    pokemons.value = resolvedPokemons;

    localStorage.setItem(`pokemons-gen-${generation}`, JSON.stringify(resolvedPokemons));
  } catch (error) {
    console.error(error);
  } finally {
    loadPlaceholder.value = false;
  }
}

const pokemonDetail = async (index) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`);

    const { data } = response;
    const pokemonIndex = pokemons.value.findIndex(pokemon => pokemon.name === data.name);
    if (pokemonIndex !== -1) {
      pokemons.value[pokemonIndex].image = data.sprites.front_default;
    }

    emit('pokemon-details-fetched', data);

  } catch (error) {
    console.error(error);
  }
}
</script>
