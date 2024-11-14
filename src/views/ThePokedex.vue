<script setup>
import { ref, onMounted } from 'vue';
import ThePokemons from '../components/ThePokemons.vue';
import PokeEvolutions from '../components/PokeEvolutions.vue';
import PokemonDetail from '../components/templates/PokemonDetail.vue';
import axios from 'axios';

const pokemonDetail = ref(null);
const audioSrc = ref(null);
const audio = ref(null);
const pokemonEvolutions = ref([]);  // Holds evolutions of selected Pokémon
const hoveredPokemonEvolutions = ref([]); // Holds evolutions of hovered Pokémon
const loadingEvolution = ref(false);
const isMobileView = ref(false);
const isPokemonClicked = ref(false);

const screenSize = () => window.innerWidth < 768;

onMounted(() => {
  isMobileView.value = screenSize();
  window.addEventListener('resize', () => {
    isMobileView.value = screenSize();
  });
});

const goBack = () => {
  isPokemonClicked.value = false;
}

const handlePokemonDetail = (selectedPokemon) => {
  pokemonDetail.value = selectedPokemon;
  playPokemonCry(pokemonDetail.value.id);

  // Update displayed evolutions with hovered evolutions on selection
  pokemonEvolutions.value = [...hoveredPokemonEvolutions.value];
}

const handlePokemonDetailsFetched = async (responseData) => {
  if (isMobileView.value) isPokemonClicked.value = true;
  loadingEvolution.value = true;
  pokemonDetail.value = responseData;
  console.log('Received pokemon details:', pokemonDetail.value);
  playPokemonCry(responseData.id);
  await fetchPokemonSpecies(responseData.species.url);
}

const fetchPokemonSpecies = async (speciesUrl, isHover = false) => {
  try {
    const response = await axios.get(speciesUrl);
    const { data } = response;
    await fetchEvolutionChain(data.evolution_chain.url, isHover);
  } catch (error) {
    console.error('Error fetching pokemon species:', error);
  }
}

const fetchEvolutionChain = async (evolutionChainUrl, isHover = false) => {
  try {
    if (!isHover) loadingEvolution.value = true;
    const response = await axios.get(evolutionChainUrl);
    const { data } = response;

    const allEvolutions = await Promise.all(
      collectEvolutions(data.chain).map(async (pokemon) => {
        pokemon.url = await getSprite(pokemon.name);
        return pokemon;
      })
    );

    if (isHover) {
      hoveredPokemonEvolutions.value = allEvolutions;
    } else {
      pokemonEvolutions.value = allEvolutions;
    }
    console.log(isHover ? 'Hovered evolutions:' : 'Selected evolutions:', allEvolutions);
  } catch (error) {
    console.error('Error fetching evolution chains:', error);
  } finally {
    if (!isHover) loadingEvolution.value = false;
  }
}

const collectEvolutions = (evolutionData, result = []) => {
  if (evolutionData.species) {
    result.push({ name: evolutionData.species.name });
  }
  if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
    for (const evolution of evolutionData.evolves_to) {
      collectEvolutions(evolution, result);
    }
  }
  return result;
};

const getSprite = async (pokemonName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    return response.data.sprites.front_default;
  } catch (error) {
    console.error('Error fetching sprite:', error);
    return null;
  }
}

const playPokemonCry = (id) => {
  audioSrc.value = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  const volumeLevel = 0.03;

  if (audio.value) {
    audio.value.pause();
    audio.value.currentTime = 0;
    audio.value.preload = 'auto';
    audio.value.src = audioSrc.value;
    audio.value.load();
    audio.value.addEventListener('canplaythrough', () => {
      audio.value.volume = volumeLevel;
      audio.value.play().catch(handleAudioError);
    });
    audio.value.addEventListener('error', handleAudioError);
  }
}

const handleAudioError = (error) => {
  console.error('Audio error:', error);
}

const fetchDataOnHover = (index) => {
  console.log('Hover on index:', index);
  hoveredPokemonEvolutions.value = []; // Clear previous hovered evolutions
  fetchPokemonSpecies(`https://pokeapi.co/api/v2/pokemon-species/${index}/`, true);
}
</script>

<template>
  <div class="md:grid grid-cols-[auto,1fr] gap-4 h-full">
    <ThePokemons
      @pokemon-details-fetched="handlePokemonDetailsFetched"
    />
    <div
      :class="
        isMobileView && isPokemonClicked ?
        'fixed top-0 left-0 w-full h-full bg-white z-10 p-5' : 
        'hidden md:flex border border-gray-300 rounded-xl p-6 flex-col overflow-y-auto'
      "
    >
      <div v-if="pokemonDetail" class="w-full">
        <PokemonDetail :pokemon-detail="pokemonDetail" @go-back="goBack" />
      </div>
      <p v-else class="w-full h-full text-lg md:text-2xl flex justify-center items-center">Select a Pokemon.</p>
      <audio ref="audio" :src="audioSrc" @error="handleAudioError"></audio>

      <div v-if="pokemonDetail && pokemonEvolutions.length" class="mt-6">
        <h2 class="text-lg md:text-xl text-start font-bold">Evolutions</h2>

        <div v-if="loadingEvolution" class="grid grid-cols-3 gap-4 mt-4">
          <div v-for="index in 3" :key="index" class="flex flex-col items-center animate-pulse">
            <div class="bg-gray-200 rounded-full h-28 w-28 mb-2"></div>
            <div class="bg-gray-300 h-6 w-20 rounded mb-1"></div>
          </div>
        </div>

        <PokeEvolutions v-else :pokemon-evolutions="pokemonEvolutions" @pokemon-detail="handlePokemonDetail"/>
      </div>
    </div>
  </div>
</template>
