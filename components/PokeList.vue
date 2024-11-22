<script setup lang="ts">
const { fetchPokemons } = usePokemons();

const { data: pokemons } = useAsyncData('pokemons', () => fetchPokemons(1));
</script>

<template>
  <transition-group
    v-if="pokemons"
  >
    <PokeCard
      v-for="pokemon in pokemons"
      :key="pokemon.name"
      :name="pokemon.name"
      :types="pokemon.types"
      :image="pokemon.image"
    />
  </transition-group>
</template>