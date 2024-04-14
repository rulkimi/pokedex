<template>
  <div class="max-h-[calc(100vh-100px)] overflow-y-auto">
    <select v-model="selectedGeneration" @change="getPokemons">
      <option value="1">Generation 1</option>
      <option value="2">Generation 2</option>
      <option value="3">Generation 3</option>
      <option value="4">Generation 4</option>
      <option value="5">Generation 5</option>
      <option value="6">Generation 6</option>
      <option value="7">Generation 7</option>
      <option value="8">Generation 8</option>
      <!-- Add more options for other generations -->
    </select>
    <ul>
      <PokeList
        v-for="(pokemon, index) in pokemons"
        :key="pokemon.name"
        :index="index + 1"
        :name="pokemon.name"
        :types="pokemon.types"
        :picture="pokemon.image"
        @click="pokemonDetail(index + 1)"
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

onMounted(() => {
  getPokemons();
});

const getPokemons = async () => {
  try {
    const cachedPokemons = localStorage.getItem(`pokemons-gen-${selectedGeneration.value}`);
    if (cachedPokemons) {
      pokemons.value = JSON.parse(cachedPokemons);
      return;
    }

    const generationLimits = {
      1: { limit: 151, offset: 0 }, // Generation 1
      2: { limit: 100, offset: 151 }, // Generation 2
      3: { limit: 135, offset: 251 }, // Generation 3
      4: { limit: 107, offset: 386 }, // Generation 4
      5: { limit: 156, offset: 493 }, // Generation 5
      6: { limit: 72, offset: 649 }, // Generation 6
      7: { limit: 88, offset: 721 }, // Generation 7
      8: { limit: 89, offset: 809 }, // Generation 8
    };


    const generation = selectedGeneration.value;
    const { limit, offset } = generationLimits[generation];

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

    localStorage.setItem(`pokemons-gen-${selectedGeneration.value}`, JSON.stringify(resolvedPokemons));
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
