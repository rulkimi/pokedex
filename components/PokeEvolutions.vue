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
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="evolution in pokemonEvolutions"
      :key="evolution.name"
      class="flex flex-col items-center cursor-pointer gap-2"
      @click="emit('pokemon-clicked', evolution.name)"
    >
      <img
        :src="evolution.url"
        width="100"
        :alt="`Picture of ${evolution.name}`"
      />
      <span>{{ formatName(evolution.name) }}</span>
    </div>
  </div>
</template>