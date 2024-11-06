<script setup>
import PokeList from './templates/PokeList.vue';

import axios from 'axios';
import { onMounted, ref, defineEmits } from 'vue';

const emit = defineEmits(['pokemon-details-fetched']);

const pokemons = ref([]);
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
    };

    const { limit, offset } = generationLimits.value[generation];

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

    const { data } = response;
    const pokemonsData = data.results;

    const pokemonDetailsPromises = pokemonsData.map(async (pokemonData) => {
      const response = await axios.get(pokemonData.url);
      const { data } = response;
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
};

const pokemonDetail = async (index) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index}`);
    const { data } = response;

    const pokemonIndex = pokemons.value.findIndex(pokemon => pokemon.name === data.name);
    if (pokemonIndex !== -1) {
      pokemons.value[pokemonIndex].image = data.sprites.front_default;
    };

    emit('pokemon-details-fetched', data);

  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="max-h-[calc(100vh-100px)] overflow-y-auto">

    <div class="sticky top-0 z-10 bg-white w-full">
      <div class="inline-block text-left w-full">
        <el-select
          v-model="selectedGeneration"
          @change="getPokemons(selectedGeneration)"
        >
          <el-option
            v-for="(n, index) in 9" 
            :key="index"
            :value="index + 1"
            :label="`Generation ${n}`"
          />
        </el-select>
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
