<script setup>
import { defineEmits } from 'vue';
import { formatIndex, formatName, formatStat, getTotalStats, getStatWidth, getMaxStat } from '../utils/formatHelper';

const emit = defineEmits(['go-back']);

defineProps({
  pokemonDetail: {
    type: Object,
    required: true
  }
});

const goBack = () => {
  emit('go-back');
}
</script>

<template>
  <div class="flex items-center justify-between">
    <img src="/arrow-left.svg" alt="go back" class="mr-2 md:hidden" @click="goBack">
    <span class="text-2xl md:text-4xl text-gray-500">{{ '#' + formatIndex(pokemonDetail.id) }}</span>
    <span class="text-2xl md:text-4xl font-bold flex-grow text-end" v-html="formatName(pokemonDetail.name)"></span>
  </div>

  <div class="flex justify-center">
    <img :src="pokemonDetail.sprites.front_default" width="200" :alt="'Picture of ' + pokemonDetail.name" />
  </div>

  <h2 class="text-lg md:text-xl text-start font-bold mb-2">Base Stats</h2>
  <div v-for="stat in pokemonDetail.stats" :key="stat.stat.name" class="flex items-center">
    <div class="flex-none text-start md:w-1/6 sm:w-1/5 text-xs md:text-sm" style="width: 50px;">{{ formatStat(stat.stat.name) }}</div>
    <div class="flex-grow bg-gray-200 rounded-full h-3 md:h-4">
      <div class="flex justify-center bg-blue-600 h-3 md:h-4 rounded-full text-white text-xxs md:text-xs" :style="{ width: getStatWidth(stat) + '%' }">
        <span class="flex items-center">{{ stat.base_stat + ' / ' + getMaxStat(stat) }}</span>
      </div>
    </div>
  </div>


  <div class="flex items-center">
    <div class="flex items-center text-xs md:text-sm">TOTAL STATS:</div>
    <div class="flex items-center bg-blue-600 h-3 md:h-4 px-2 ml-2 rounded-full text-white text-xxs md:text-xs">{{ getTotalStats(pokemonDetail.stats) }}</div>
  </div>
</template>

<style scoped>
.text-xxs {
  font-size: 0.625rem; /* 10px */
  line-height: 0.75rem; /* 12px */
}
</style>