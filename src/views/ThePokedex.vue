<template>
  <div class="grid grid-cols-[auto,1fr] gap-4 h-full">
    <ThePokemons @pokemonDetailsFetched="handlePokemonDetailsFetched" />
    <div class="flex border border-gray-300 rounded-xl items-center justify-center">
      <!-- Placeholder for pokemon details -->
      <p class="">Pokemon details area</p>
      <audio ref="audio" :src="audioSrc" @error="handleAudioError"></audio>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ThePokemons from '../components/ThePokemons.vue';

const pokemonDetail = ref([]);
const audioSrc = ref(null);
const audio = ref(null);

const handlePokemonDetailsFetched = (responseData) => {
  console.log('Received pokemon details:', responseData);
  // Handle the received pokemon details here
  playPokemonCry(responseData.id);
}

const playPokemonCry = (id) => {
  audioSrc.value = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  const volumeLevel = 0.01;

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
