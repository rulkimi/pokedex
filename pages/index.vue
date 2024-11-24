<script setup lang="ts">
useHead({
  title: 'Pokédex',
  meta: [
    { name: 'description', content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' }
  ],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/pokedex-logo.svg'}]
});

const pokemonDetail = ref();
const pokemonEvolutions = ref<{ name: string, url: string }[]>([]);
const audio = ref();
const pokemonCryAudioSrc = ref();
const volumeLevel = 0.05;

const onImageClicked = (id: number) => {
  playPokemonCry(id);
}

const { fetchPokemonDetails, fetchPokemonEvolutions, fetchPokemonCrySrc } = usePokemons();
const store = useMainStore();

const onPokemonClicked = async (pokemonName: string) => {
  store.setActivePokemon(pokemonName);
  pokemonDetail.value = await fetchPokemonDetails(pokemonName);
  playPokemonCry(pokemonDetail.value.id);
  pokemonEvolutions.value = await fetchPokemonEvolutions(pokemonName);
}

const playPokemonCry = (id: number) => {
  if (!audio.value) return;

  pokemonCryAudioSrc.value = fetchPokemonCrySrc(id);

  audio.value.pause();
  audio.value.currentTime = 0;
    audio.value.preload = 'auto';
    audio.value.src = pokemonCryAudioSrc.value;
    audio.value.load();
    audio.value.addEventListener('canplaythrough', () => {
      audio.value.volume = volumeLevel;
      audio.value.play();
    });
}
</script>

<template>
  <div class="md:grid grid-cols-[auto,1fr] gap-4 h-full">
    <PokeList @pokemon-clicked="onPokemonClicked" />
    <div class="hidden md:flex shadow-inner rounded-xl p-6 flex-col overflow-y-auto">
      <div v-if="pokemonDetail" class="w-full">
        <PokeDetail
          :pokemon-detail="pokemonDetail"
          @image-clicked="onImageClicked"
        />
      </div>

      <div v-if="pokemonDetail && pokemonEvolutions.length" class="mt-8">
        <PokeEvolutions :pokemon-evolutions="pokemonEvolutions" />
      </div>
    </div>

    <audio ref="audio" :src="pokemonCryAudioSrc"></audio>
  </div>
</template>