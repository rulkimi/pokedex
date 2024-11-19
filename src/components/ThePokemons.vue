<script setup>
import PokeList from './templates/PokeList.vue';
import FormInput from './templates/FormInput.vue';
import FormSelect from './templates/FormSelect.vue';

import axios from 'axios';
import { onMounted, ref, defineEmits, computed, watch, nextTick } from 'vue';
import { useMainStore } from '../stores';

const emit = defineEmits(['pokemon-details-fetched', 'hovered']);
const store = useMainStore();

const pokemons = ref([]);
const loadPlaceholder = ref(false);
const inputSearchPokemon = ref('');

onMounted(() => {
  getPokemons(store.selectedGeneration);
});

watch(() => store.selectedGeneration, async (newVal) => {
  await getPokemons(newVal);
  scrollToPokemon(store.activePokemon);
});

const getPokemons = async (generation) => {
  store.setSelectedGeneration(generation);
  console.log('inside get pokemons')
  loadPlaceholder.value = true;
  try {
    const cachedPokemons = localStorage.getItem(`pokemons-gen-${generation}`);
    if (cachedPokemons) {
      pokemons.value = JSON.parse(cachedPokemons);
      return;
    };

    const { limit, offset } = store.generationLimits[generation];

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

const onClickPokemon = (pokemonName, originalIndex) => {
  store.setActivePokemon(pokemonName);
  pokemonDetail(originalIndex + 1 + store.generationLimits[store.selectedGeneration].offset);
};

const scrollToPokemon = async (pokemonName) => {
  await nextTick();
  const element = document.getElementById('scrollId-' + pokemonName);
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
          v-model="store.selectedGeneration"
          width="w-24"
          input-class="border-r border-y rounded-l-none"
          :options="store.generations"
          @change="getPokemons(store.selectedGeneration)"
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
        :id="'scrollId-' + pokemon.name"
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        :index="pokemons.findIndex(p => p.name === pokemon.name) + 1 + store.generationLimits[store.selectedGeneration].offset"
        :name="pokemon.name"
        :types="pokemon.types"
        :picture="pokemon.image"
        :is-active="pokemon.name === store.activePokemon"
        @click="onClickPokemon(pokemon.name, pokemons.findIndex(p => p.name === pokemon.name))"
        @mouseover="emit('hovered', pokemons.findIndex(p => p.name === pokemon.name) + 1 + store.generationLimits[store.selectedGeneration].offset)"
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
