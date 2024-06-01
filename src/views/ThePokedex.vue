<template>
  <div class="md:grid grid-cols-[auto,1fr] gap-4 h-full">
    <ThePokemons @pokemon-details-fetched="handlePokemonDetailsFetched" />
    <div class="hidden md:flex border border-gray-300 rounded-xl p-6 flex-col max-h-[calc(100vh-100px)] overflow-y-auto">
      <div v-if="pokemonDetail" class="w-full">
        <PokemonDetail :pokemon-detail="pokemonDetail" />
      </div>
      <p v-else class="w-full h-full text-lg md:text-2xl flex justify-center items-center">Select a Pokemon.</p>
      <audio ref="audio" :src="audioSrc" @error="handleAudioError"></audio>

      <div v-if="pokemonDetail && pokemonEvolutions.length" class="mt-6">
        <h2 class="text-lg md:text-xl text-start font-bold">Evolutions</h2>

        <!-- evolution placeholder -->
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

<script setup>
import { ref } from 'vue';
import ThePokemons from '../components/ThePokemons.vue';
import PokeEvolutions from '../components/PokeEvolutions.vue';
import PokemonDetail from '../components/PokemonDetail.vue';

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
  loadingEvolution.value = true;
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
  } finally {
    setTimeout(() => {
      loadingEvolution.value = false;
    }, 1000);
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
