<script setup lang="ts">
const { fetchPokemons } = usePokemons();

const { data: pokemons } = useAsyncData('pokemons', () => fetchPokemons(1));

</script>

<template>
  {{ pokemons }}
</template>