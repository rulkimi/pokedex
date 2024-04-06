<template>
  <div class="max-h-[calc(100vh-100px)] overflow-y-auto">
    <ul>
      <PokeList
        v-for="(pokemon, index) in pokemons"
        :key="pokemon.name"
        :index="index + 1"
        :name="pokemon.name"
        :types="pokemon.types"
        :picture="pokemon.image"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PokeList from './PokeList.vue';

const pokemons = ref([]);

onMounted(() => {
  getPokemons();
  console.log(pokemons)
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
