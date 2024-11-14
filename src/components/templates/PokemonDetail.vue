<script setup>
import { defineEmits, computed } from 'vue';
import { formatIndex, formatName, formatStat, getTotalStats, getStatWidth, formatAndArrangeType, getTypeColor } from '../../utils/formatHelper';

const emit = defineEmits(['go-back']);

const props = defineProps({
  pokemonDetail: {
    type: Object,
    required: true
  }
});

console.log('props', props.pokemonDetail)

const goBack = () => {
  emit('go-back');
}

const arrangedTypes = computed(() => formatAndArrangeType(props.pokemonDetail.types))
</script>

<template>
  <div class="flex items-center justify-between">
    <img src="/arrow-left.svg" alt="go back" class="mr-2 md:hidden" @click="goBack">
    <span class="text-2xl md:text-4xl text-gray-500">{{ '#' + formatIndex(pokemonDetail.id) }}</span>
    <span class="text-2xl md:text-4xl font-bold flex-grow text-end" v-html="formatName(pokemonDetail.name)"></span>
  </div>

  <div class="relative flex justify-center items-center">
    <img
      class="object-cover"
      :src="pokemonDetail.sprites.front_default"
      width="200"
      :alt="'Picture of ' + pokemonDetail.name"
    />
    <div class="absolute inset-0 flex items-center justify-center">
      <div :class="`shadow-inner w-40 h-40 bg-${getTypeColor(arrangedTypes[0])}/5 rounded-full`"></div>
    </div>
  </div>

  <h2 class="text-lg md:text-xl text-start font-bold mb-2">Base Stats</h2>
  <div v-for="stat in pokemonDetail.stats" :key="stat.stat.name" class="flex items-center -mr-2 font-semibold">
    <div class="flex-none text-start md:w-1/6 sm:w-1/5 text-xs md:text-sm" style="width: 50px;">{{ formatStat(stat.stat.name) }}</div>
    <div class="flex-grow bg-gray-200 rounded-full h-3 md:h-4">
      <div class="flex justify-center bg-blue-600 h-3 md:h-4 rounded-full text-white text-xxs md:text-xs" :style="{ width: getStatWidth(stat) + '%' }"></div>
    </div>
    <div class="w-12 flex justify-center">{{ stat.base_stat }}</div>
  </div>

  <div class="flex items-center justify-end mt-2 -mr-1 gap-4">
    <span class="font-semibold">TOTAL STATS: </span>
    <span class="px-2 py-1 rounded-full bg-blue-600 text-white ">{{ getTotalStats(pokemonDetail.stats) }}</span>
  </div>
</template>

<style scoped>
.text-xxs {
  font-size: 0.625rem; /* 10px */
  line-height: 0.75rem; /* 12px */
}
</style>