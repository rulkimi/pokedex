<template>
  <li class="border border-gray-300 rounded-xl px-5 mb-2 cursor-pointer hover:bg-gray-100 flex items-center">
    <div class="flex flex-col mr-4">
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-2">{{ '#' + formatIndex(index) }}</div>
        <div class="font-semibold" v-html="formatName(name)"></div>
      </div>
      
      <div class="flex flex-wrap mt-2">
        <div
          v-for="pokemonType in types"
          :class="[typeColor(pokemonType)]"
          class="rounded-full text-white text-xs px-2 py-1 mr-1 mb-1"
        >
          {{ pokemonType }}
        </div>
      </div>
    </div>
    
    <img :src="picture" :alt="'Picture of ' + name" class="ml-auto">
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { formatIndex, formatName } from '../utils/formatHelper';

defineProps({
  index: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  types: {
    type: Array,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
});

const typeColor = computed(() => {
  return (pokemonType) => {
    switch(pokemonType) {
      case 'grass':
        return 'bg-emerald-500';
      case 'fire':
        return 'bg-red-700';
      case 'water':
        return 'bg-blue-500';
      case 'electric':
        return 'bg-yellow-400';
      case 'bug':
        return 'bg-green-700';
      case 'poison':
        return 'bg-fuchsia-800';
      case 'normal':
        return 'bg-gray-400';
      case 'ice':
        return 'bg-cyan-300';
      case 'ground':
        return 'bg-yellow-900';
      case 'fighting':
        return 'bg-red-700';
      case 'flying':
        return 'bg-indigo-400';
      case 'psychic':
        return 'bg-pink-500';
      case 'rock':
        return 'bg-yellow-600';
      case 'ghost':
        return 'bg-indigo-700';
      case 'dragon':
        return 'bg-indigo-900';
      case 'dark':
        return 'bg-gray-800';
      case 'steel':
        return 'bg-gray-600';
      case 'fairy':
        return 'bg-pink-300';
      default:
        return 'bg-gray-500';
    }
  };
});
</script>
