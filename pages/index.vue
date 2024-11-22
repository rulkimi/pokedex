<script setup lang="ts">
const { fetchPokemons, fetchPokemonDetails } = usePokemons();

const { data: pokemons } = useAsyncData('pokemons', () => fetchPokemonDetails(1));

</script>

<template>
  {{ pokemons }}
</template>