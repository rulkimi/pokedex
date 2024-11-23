<script setup lang="ts">
interface PokemonDetail {
  id: number
  name: string
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
  sprites: {
    front_default: string
  }
}

const props = defineProps<{
  pokemonDetail: PokemonDetail
}>();

const emit = defineEmits(['go-back', 'image-clicked'])

const arrangedTypes = computed(() => formatAndArrangeType(props.pokemonDetail.types));
</script>

<template>
  <div>

    <div class="flex items-center justify-between">
      <div :icon="ElIconArrowLeft"></div>
      <span class="text-2xl md:text-4xl text-gray-500">
        {{ '#' + formatIndex(pokemonDetail.id) }}
      </span>
      <span
        class="text-2xl md:text-4xl font-bold flex-grow text-end"
        v-html="formatName(pokemonDetail.name)"
      ></span>
    </div>

    <div class="flex justify-center">
      <div
        class="relative flex justify-center items-center group cursor-pointer w-fit"
        @click="emit('image-clicked')"
      >
        <img
          :src="pokemonDetail.sprites.front_default"
          :alt="`Image of ${pokemonDetail.name}`"
          class="object-cover group-hover:scale-125 transition-transform duration-300"
          width="200"
        >
        <div class="absolute inset-0 flex items-center justify-center">
          <div :class="`shadow-inner w-40 h-40 bg-${getTypeColor(arrangedTypes[0])}/5 group-hover:bg-${getTypeColor(arrangedTypes[0])}/20 transition-colors duration-300 rounded-full z-[-1]`"></div>
        </div>
      </div>
    </div>

    <h2 class="text-lg md:text-xl text-start font-bold mb-2">Base Stats</h2>

    <div
      v-for="stat in pokemonDetail.stats"
      :key="stat.stat.name"
      class="flex items-center -mr-2 font-semibold"
    >
      <div class="flex-none text-start md:w-1/6 sm:w-1/5 text-xs md:text-sm w-[50px]">{{ formatStat(stat.stat.name) }}</div>
      <div class="flex-grow bg-gray-200 rounded-full h-3 md:h-4">
        <div
          class="flex justify-center bg-blue-600 h-3 md:h-4 rounded-full text-white text-xxs md:text-xs"
          :style="{ width: getStatWidth(stat) + '%' }"
        ></div>
      </div>
      <div class="w-12 flex justify-center">{{ stat.base_stat }}</div>
    </div>

    <div class="flex items-center justify-end mt-2 -mr-1 gap-4">
      <span class="font-semibold">TOTAL STATS: </span>
      <span class="px-2 py-1 rounded-full bg-blue-600 text-white ">
        {{ getTotalStats(pokemonDetail.stats) }}
      </span>
    </div>

  </div>
</template>