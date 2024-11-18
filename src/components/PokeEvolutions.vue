<script setup>
import { formatName } from '@/utils/formatHelper';
import { defineProps, defineEmits } from 'vue';
import { useMainStore } from '../stores';

import axios from 'axios';

defineProps({
  pokemonEvolutions: {
    type: Array,
    required: true
  }
});

const emit  = defineEmits(['pokemonDetail']);

const store = useMainStore();

const sendPokemonDetail = async (pokemonName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const { data } = response;

    emit('pokemonDetail', data);
    store.setActivePokemon(pokemonName);
  } catch (error) {
    console.error('Error fetching pokemon detail', error);
  }
};
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div 
      v-for="evolution in pokemonEvolutions" 
      :key="evolution.name" 
      class="flex flex-col items-center cursor-pointer" 
      @click="sendPokemonDetail(evolution.name)"
    >
      <img 
        :src="evolution.url" 
        width="100" 
        :alt="'Picture of ' + evolution.name" 
        class="mb-2"
      />
      <span>{{ formatName(evolution.name) }}</span>
    </div>
  </div>
</template>
