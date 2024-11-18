import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const activePokemon = ref('');

  const setActivePokemon = pokemonName => {
    activePokemon.value = pokemonName;
  }

  return { activePokemon, setActivePokemon };
});