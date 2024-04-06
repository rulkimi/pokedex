<template>
  <div class="grid grid-cols-[auto,1fr] h-full">
    <ThePokemons />
    <div class="flex items-center justify-center">
      <!-- Placeholder for pokemon details -->
      <p class="text-center">Pokemon details area</p>
    </div>
  </div>
</template>

<script setup>
import ThePokemons from '../components/ThePokemons.vue';
</script>

