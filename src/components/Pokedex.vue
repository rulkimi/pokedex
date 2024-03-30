<template>
  <div>
    <div
      class="cursor-pointer inline-flex"
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
});

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
      return {
        name: pokemonData.name,
        url: pokemonData.url,
        image: pokemonDetails.sprites.front_default
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

  } catch (error) {
    console.error(error);
  }
}
</script>
