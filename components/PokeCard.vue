<script setup lang="ts">
const props = defineProps<{
  index: number
  name: string
  types: string[]
  image: string
  isActive: boolean
}>();

const arrangedTypes = computed(() => arrangeType(props.types));
</script>

<template>
  <li
    class="group rounded-xl px-5 py-2 md:py-0 cursor-pointer flex items-center justify-between md:w-[300px] transition-all duration-500"
    :class="isActive ? `bg-${getTypeColor(arrangedTypes[0])}/20 !border-${getTypeColor(arrangedTypes[0])}` : `hover:bg-${getTypeColor(arrangedTypes[0])}/20 hover:!border-${getTypeColor(arrangedTypes[0])}`"
  >
    <div class="flex flex-col mr-4">
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-2">
          {{ "#" + formatIndex(index) }}
        </div>
        <div class="font-semibold" v-html="formatName(name)"></div>
      </div>
      <div class="flex flex-wrap mt-2">
        <div
          v-for="pokemonType in arrangedTypes"
          :class="`bg-${getTypeColor(pokemonType)}`"
          class="rounded-full text-white text-xs px-2 py-1 pb-1.5 mr-1 mb-1"
        >
          {{ pokemonType }}
        </div>
      </div>
    </div>
    <NuxtImg
      :src="image" 
      :alt="`Image of ${name}`"
      class="!w-20 !h-20 object-contain md:w-full"
      :class="isActive ? 'scale-150 rotate-6' : 'group-hover:scale-150 group-hover:rotate-6 transition-transform duration-500'"
    />
  </li>
</template>