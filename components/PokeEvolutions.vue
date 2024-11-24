<script setup lang="ts">
const props = defineProps<{
  pokemonEvolutions:{
    name: string
    url: string
  }[]
}>();

const emit = defineEmits(['pokemon-clicked']);
</script>

<template>
  <h2 class="text-lg md:text-xl text-start font-bold">Evolutions</h2>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="evolution in pokemonEvolutions"
      :key="evolution.name"
      class="flex flex-col items-center cursor-pointer gap-2"
      @click="emit('pokemon-clicked', evolution.name)"
    >
      <NuxtImg
        :src="evolution.url"
        width="100"
        :alt="`Picture of ${evolution.name}`"
      />
      <span v-html="formatName(evolution.name)"></span>
    </div>
  </div>
</template>