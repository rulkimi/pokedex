<script setup lang="ts">
useHead({
  title: 'Pokédex',
  meta: [
    { name: 'description', content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/pokedex-logo.svg' }
  ]
});


const pokemonDetail = ref();
const pokemonEvolutions = ref<{ name: string, url: string }[]>([]);
const audio = ref();
const pokemonCryAudioSrc = ref();
const volumeLevel = ref(0.05);
const isMobileView = ref(false);
const isPokemonClicked = ref(false);

const screenSize = () => window.innerWidth < 768;

onMounted(() => {
  isMobileView.value = screenSize();
  window.addEventListener('resize', () => {
    isMobileView.value = screenSize();
  });
});

const onImageClicked = (id: number) => {
  playPokemonCry(id);
}

const { fetchPokemonDetails, fetchPokemonEvolutions, fetchPokemonCrySrc } = usePokemons();
const store = useMainStore();

const onPokemonClicked = async (pokemonName: string) => {
  isPokemonClicked.value = true;
  store.setActivePokemon(pokemonName);
  pokemonDetail.value = await fetchPokemonDetails(pokemonName);
  store.checkIsIdWithinSelectedGeneration(pokemonDetail.value.id);
  playPokemonCry(pokemonDetail.value.id);
  pokemonEvolutions.value = await fetchPokemonEvolutions(pokemonName);
}

const playPokemonCry = (id: number) => {
  if (!audio.value) return;

  pokemonCryAudioSrc.value = fetchPokemonCrySrc(id);

  audio.value.pause();
  audio.value.currentTime = 0;
    audio.value.preload = 'auto';
    audio.value.muted = false;
    audio.value.src = pokemonCryAudioSrc.value;
    audio.value.load();
    audio.value.addEventListener('canplaythrough', () => {
      audio.value.volume = volumeLevel.value;
      audio.value.play();
    });
}
</script>

<template>
  <div class="md:grid grid-cols-[auto,1fr] gap-4 h-full">
    <PokeList @pokemon-clicked="onPokemonClicked" />
    <div
      :class="
        isMobileView && isPokemonClicked ?
        'fixed top-0 left-0 w-full h-full bg-white z-10 p-5' : 
        'hidden md:flex shadow-inner rounded-xl p-6 flex-col overflow-y-auto'
      "
    >
      <div v-if="pokemonDetail" class="w-full">
        <PokeDetail
          :pokemon-detail="pokemonDetail"
          :is-mobile-view="isMobileView"
          @image-clicked="onImageClicked"
          @go-back="isPokemonClicked = false"
        />
      </div>
      <p v-else class="w-full h-full text-lg md:text-xl text-slate-400 flex justify-center items-center">
        Select a Pokémon
      </p>

      <div v-if="pokemonDetail && pokemonEvolutions.length" class="mt-8">
        <PokeEvolutions
          :pokemon-evolutions="pokemonEvolutions"
          @pokemon-clicked="onPokemonClicked"
        />
      </div>
    </div>

    <audio ref="audio" :src="pokemonCryAudioSrc" preload="auto"></audio>
  </div>
</template>