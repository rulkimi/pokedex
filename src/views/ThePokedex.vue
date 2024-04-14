<template>
  <div class="grid grid-cols-[auto,1fr] gap-4 h-full">
    <ThePokemons @pokemonDetailsFetched="handlePokemonDetailsFetched" />
    <div class="flex border border-gray-300 rounded-xl p-6 flex-col max-h-[calc(100vh-100px)] overflow-y-auto">
      <div v-if="pokemonDetail" class="w-full">
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
            <div class="bg-blue-600 h-4 rounded-full text-white text-xs" :style="{ width: getStatWidth(stat) + '%' }">{{ stat.base_stat + ' / ' + getMaxStat(stat) }}</div>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex items-center">TOTAL STATS:</div>
          <div class="bg-blue-600 h-4 px-2 ml-2 rounded-full text-white text-xs">{{ getTotalStats(pokemonDetail.stats) }}</div>
        </div>
        
      </div>
      <p v-else class="">Pokemon details area</p>
      <audio ref="audio" :src="audioSrc" @error="handleAudioError"></audio>

      <div v-if="pokemonDetail && pokemonEvolutions.length" class="mt-6">
        <h2 class="text-xl text-start font-bold">Evolutions</h2>
        <PokeEvolutions :pokemonEvolutions="pokemonEvolutions" @pokemonDetail="handlePokemonDetail"/>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatIndex, formatName, formatStat, getStatWidth, getMaxStat, getTotalStats } from '../utils/formatHelper';
import ThePokemons from '../components/ThePokemons.vue';
import PokeEvolutions from '../components/PokeEvolutions.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const pokemonDetail = ref(null);
const audioSrc = ref(null);
const audio = ref(null);
const pokemonEvolutions = ref([]);
const loadingEvolution = ref(false);

const handlePokemonDetail = (selectedPokemon) => {
  pokemonDetail.value = selectedPokemon;
  playPokemonCry(pokemonDetail.value.id);
}

const handlePokemonDetailsFetched = async (responseData) => {
  pokemonDetail.value = responseData;
  console.log('Received pokemon details:', pokemonDetail.value);
  playPokemonCry(responseData.id);
  await fetchPokemonSpecies(responseData.species.url);
}

const fetchPokemonSpecies = async (speciesUrl) => {
  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    console.log(data)
    await fetchEvolutionChain(data.evolution_chain.url);
  } catch (error) {
    console.error('Error fetching pokemon species:', error);
  }
}

const fetchEvolutionChain = async (evolutionChainUrl) => {
  try {
    const response = await fetch(evolutionChainUrl);
    const data = await response.json();
    console.log(data);

    const allEvolutions = await Promise.all(
      collectEvolutions(data.chain).map(async (pokemon) => {
        pokemon.url = await getSprite(pokemon.name);
        return pokemon;
      })
    );
    pokemonEvolutions.value = allEvolutions;
    console.log('All evolutions:', allEvolutions);
  } catch (error) {
    console.error('Error fetching evolution chains:', error);
  }
}

// Function to recursively traverse the evolution chain and collect evolution names
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
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data.sprites.front_default;
  } catch (error) {
    console.error('Error fetching sprite:', error);
    return null;
  }
}


const playPokemonCry = (id) => {
  audioSrc.value = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  const volumeLevel = 0.03;

  if (audio.value) {
    // Reset the audio element
    audio.value.pause();
    audio.value.currentTime = 0;

    // Preload the audio and handle the "canplaythrough" event
    audio.value.preload = 'auto';
    audio.value.src = audioSrc.value;
    audio.value.load();
    audio.value.addEventListener('canplaythrough', () => {
      // Once the audio is ready, play it
      audio.value.volume = volumeLevel;
      audio.value.play().catch(handleAudioError);
    });

    // Listen for other error events
    audio.value.addEventListener('error', (event) => {
      handleAudioError(event);
    });
  }
}

const handleAudioError = (error) => {
  console.error('Audio error:', error);
  console.log('Audio source:', audioSrc.value);
}
</script>
