<template>
  <div class="flex justify-between">
    <span class="text-4xl text-gray-500">{{ '#' + formatIndex(pokemonDetail.id) }}</span>
    <span class="text-4xl font-bold flex-grow text-end" v-html="formatName(pokemonDetail.name)"></span>
  </div>

  <div class="flex justify-center">
    <img :src="pokemonDetail.sprites.front_default" width="200" :alt="'Picture of ' + pokemonDetail.name" />
  </div>

  <h2 class="text-xl text-start font-bold mb-2">Base Stats</h2>
  <div v-for="stat in pokemonDetail.stats" :key="stat.stat.name" class="flex items-center">
    <div class="flex-none text-start" style="width: 50px;">{{ formatStat(stat.stat.name) }}</div>
    <div class="flex-grow bg-gray-200 rounded-full h-4 dark:bg-gray-700">
      <div class="bg-blue-600 h-4 rounded-full text-white text-xs" :style="{ width: getStatWidth(stat) + '%' }">{{
      stat.base_stat + ' / ' + getMaxStat(stat) }}</div>
    </div>
  </div>

  <div class="flex items-center">
    <div class="flex items-center">TOTAL STATS:</div>
    <div class="bg-blue-600 h-4 px-2 ml-2 rounded-full text-white text-xs">{{ getTotalStats(pokemonDetail.stats) }}
    </div>
  </div>
</template>

<script setup>
import { formatIndex, formatName, formatStat, getTotalStats, getStatWidth, getMaxStat } from '../utils/formatHelper';

defineProps({
  pokemonDetail: {
    type: Object,
    required: true
  }
});
</script>