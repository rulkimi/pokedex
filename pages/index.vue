<script setup lang="ts">
useHead({
  title: 'Pokédex',
  meta: [
    { name: 'description', content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' }
  ],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/pokedex-logo.svg'}]
})
</script>

<template>
  <PokeList />
</template>