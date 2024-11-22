<script setup lang="ts">
const props = defineProps<{
  index?: number
  name: string
  types: string[]
  image: string
  isActive?: boolean
}>();
</script>

<template>
  <li class="group rounded-xl px-5 py-2 md:py-0 cursor-pointer flex items-center justify-between md:w-[300px]">
    <div class="flex flex-col mr-4">
      <div class="flex items-center">
        <div class="text-sm text-gray-500 mr-2">
          {{ "#" + index }}
        </div>
        <div class="font-semibold" v-html="name"></div>
      </div>
    </div>
    <div class="flex flex-wrap mt-2">
      <div
        v-for="pokemonType in types"
        class="rounded-full text-xs px-2 py-1 pb-1.5 mr-1 mb-1"
      >
        {{ pokemonType }}
      </div>
    </div>
    <img 
      :src="image" 
      :alt="`Image of ${name}`"
      class="!w-20 !h-20 object-contain md:w-full"
    >
  </li>
</template>