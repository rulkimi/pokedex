<script setup lang="ts">
const { fetchPokemons, fetchPokemonDetails, fetchPokemonEvolutions } = usePokemons();

const { data: pokemons } = useAsyncData('pokemons', () => fetchPokemonEvolutions(1));

</script>

<template>
  {{ pokemons }}
</template>