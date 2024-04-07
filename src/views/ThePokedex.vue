<template>
  <div class="grid grid-cols-[auto,1fr] gap-4 h-full">
    <ThePokemons @pokemonDetailsFetched="handlePokemonDetailsFetched" />
    <div class="flex border border-gray-300 rounded-xl p-6">
      <!-- Placeholder for pokemon details -->
      <div v-if="pokemonDetail" class="w-full">
        <div class="flex justify-between">
          <span class="text-4xl text-gray-500">{{ '#' + formatIndex(pokemonDetail.id) }}</span>
          <span class="text-4xl font-bold flex-grow text-end" v-html="formatName(pokemonDetail.name)"></span>
        </div>
        <img :src="pokemonDetail.sprites.front_default" width="300" :alt="'Picture of ' + pokemonDetail.name" />
        <div v-for="stat in pokemonDetail.stats" class="flex items-center">
          <div class="flex-none text-start" style="width: 50px;">{{ formatStat(stat.stat.name) }}</div>
          <div class="flex-grow bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div class="bg-blue-600 h-4 rounded-full text-white text-xs" :style="{ width: getStatWidth(stat) + '%' }">{{ stat.base_stat + ' / ' + getMaxStat(stat) }}</div>
          </div>
        </div>
      </div>
      <p v-else class="">Pokemon details area</p>
      <audio ref="audio" :src="audioSrc" @error="handleAudioError"></audio>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatIndex, formatName, formatStat, getStatWidth, getMaxStat } from '../utils/formatHelper';
import ThePokemons from '../components/ThePokemons.vue';

const pokemonDetail = ref(null);
const audioSrc = ref(null);
const audio = ref(null);

const handlePokemonDetailsFetched = (responseData) => {
  pokemonDetail.value = responseData;
  console.log('Received pokemon details:', pokemonDetail.value);
  playPokemonCry(responseData.id);
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
