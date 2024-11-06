<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="evolution in pokemonEvolutions" :key="evolution.name" class="flex flex-col items-center cursor-pointer" @click="sendPokemonDetail(evolution.name)">
      <img :src="evolution.url" width="100" :alt="'Picture of ' + evolution.name" class="mb-2" />
      <span>{{ formatName(evolution.name) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatName } from '../utils/formatHelper';
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

defineProps({
  pokemonEvolutions: {
    type: Array,
    required: true
  }
});

const emit  = defineEmits(['pokemonDetail']);

const sendPokemonDetail = async (pokemonName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    console.log(response)
    const { data } = response;
    console.log(data)

    emit('pokemonDetail', data);
    
  } catch (error) {
    console.error('Error fetching pokemon detail', error);
  }
}
</script>
