<script setup>
import PokeList from './templates/PokeList.vue';
import FormInput from './templates/FormInput.vue';
import FormSelect from './templates/FormSelect.vue';

import axios from 'axios';
import { onMounted, ref, defineEmits, computed } from 'vue';
import { useMainStore } from '../stores';

const emit = defineEmits(['pokemon-details-fetched', 'hovered']);

const pokemons = ref([]);
const generations = ref([
  { label: 'Gen 1', value: 1 },
  { label: 'Gen 2', value: 2 },
  { label: 'Gen 3', value: 3 },
  { label: 'Gen 4', value: 4 },
  { label: 'Gen 5', value: 5 },
  { label: 'Gen 6', value: 6 },
  { label: 'Gen 7', value: 7 },
  { label: 'Gen 8', value: 8 },
  { label: 'Gen 9', value: 9 },
]);
const selectedGeneration = ref(1);
const loadPlaceholder = ref(false);
const inputSearchPokemon = ref('');

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

    console.log(pokemons.value)

    loadPlaceholder.value = false;
  }
};

const filteredPokemons = computed(() => {
  if (!inputSearchPokemon.value) return pokemons.value;
  return pokemons.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(inputSearchPokemon.value.toLowerCase())
  );
});

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

const store = useMainStore();

const onClickPokemon = (pokemonName, originalIndex) => {
  store.setActivePokemon(pokemonName);
  pokemonDetail(originalIndex + 1 + generationLimits.value[selectedGeneration.value].offset);
};
</script>

<template>
  <div>

    <div class="sticky top-0 z-10 bg-white w-full">
      <div class="flex">
        <FormInput
          id="search-pokemon"
          class="flex-grow"
          input-class="border-x border-y rounded-r-none flex-grow"
          placeholder="Search pokemon"
          v-model="inputSearchPokemon"
        >
          <template #prepend-icon>
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </template>
        </FormInput>
        <FormSelect
          id="select-generation"
          v-model="selectedGeneration"
          width="w-24"
          input-class="border-r border-y rounded-l-none"
          :options="generations"
          @change="getPokemons(selectedGeneration)"
        />
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

    <transition-group
      v-else
      name="list"
      tag="ul"
      class="flex flex-col gap-1 mt-4 h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden"
      mode="out-in"
    >
      <PokeList
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        :index="pokemons.findIndex(p => p.name === pokemon.name) + 1 + generationLimits[selectedGeneration].offset"
        :name="pokemon.name"
        :types="pokemon.types"
        :picture="pokemon.image"
        :is-active="pokemon.name === store.activePokemon"
        @click="onClickPokemon(pokemon.name, pokemons.findIndex(p => p.name === pokemon.name))"
        @mouseover="emit('hovered', pokemons.findIndex(p => p.name === pokemon.name) + 1 + generationLimits[selectedGeneration].offset)"
      />
    </transition-group>

  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.list-leave-active {
  position: absolute;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-move {
  transition: transform 0.3s ease-in-out;
}
</style>
