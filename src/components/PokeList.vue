<script setup>
import { formatIndex, formatName, getTypeColor } from '../utils/formatHelper';

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
</script>

<template>
  <li class="border border-gray-300 rounded-xl px-5 py-2 md:py-0 mb-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between md:w-[300px]">
    <div class="flex flex-col mr-4">
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-2">{{ '#' + formatIndex(index) }}</div>
        <div class="font-semibold" v-html="formatName(name)"></div>
      </div>
      
      <div class="flex flex-wrap mt-2">
        <div
          v-for="pokemonType in types"
          :class="[getTypeColor(pokemonType)]"
          class="rounded-full text-white text-xs px-2 py-1 pb-1.5 mr-1 mb-1"
        >
          {{ pokemonType }}
        </div>
      </div>
    </div>
    
    <img :src="picture" :alt="'Picture of ' + name" class="!w-20 !h-20 object-contain md:w-full">
  </li>
</template>
