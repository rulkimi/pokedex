<script setup lang="ts">
useHead({
  title: 'Pokédex',
  meta: [
    { 
      name: 'description',
      content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' 
    },
    { 
      name: 'viewport', 
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0' 
    },
    { property: 'og:url', content: 'https://rulkimi.github.io/pokedex/' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Pokédex' },
    { property: 'og:description', content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' },
    { property: 'og:image', content: 'https://opengraph.b-cdn.net/production/images/b4580fc0-5e0b-4a2d-904a-4ef9fb239bba.png?token=WkdtwATl5DIIqlHorpW1uzKHWjrqhcKfpv1LScsyT44&height=772&width=1200&expires=33282278656' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:domain', content: 'rulkimi.github.io' },
    { property: 'twitter:url', content: 'https://rulkimi.github.io/pokedex/' },
    { name: 'twitter:title', content: 'Pokédex' },
    { name: 'twitter:description', content: 'Explore a detailed collection of Pokémon species, their abilities, evolutions, and more! Dive into the world of Pokémon with comprehensive stats and exciting facts.' },
    { name: 'twitter:image', content: 'https://opengraph.b-cdn.net/production/images/b4580fc0-5e0b-4a2d-904a-4ef9fb239bba.png?token=WkdtwATl5DIIqlHorpW1uzKHWjrqhcKfpv1LScsyT44&height=772&width=1200&expires=33282278656' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/pokedex-logo.svg' }
  ]
});

const pokemonDetail = ref();
const pokemonEvolutions = ref<{ name: string, url: string }[]>([]);
const isMobileView = ref(false);
const isPokemonClicked = ref(false);
const showGuessAlert = ref(true);

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

const hoveredEvolutions = ref();
const onPokemonHovered = async (pokemonName: string) => {
  hoveredEvolutions.value = await fetchPokemonEvolutions(pokemonName);
}

const { fetchPokemonDetails, fetchPokemonEvolutions } = usePokemons();
const store = useMainStore();

const isEvolutionsLoading = ref(false);
const isPokemonDetailLoading = ref(false);

const onPokemonClicked = async (pokemonName: string) => {
  pokemonDetail.value = null;
  isPokemonClicked.value = true;
  pokemonEvolutions.value = [];
  store.setActivePokemon(pokemonName);

  isPokemonDetailLoading.value = true;
  pokemonDetail.value = await fetchPokemonDetails(pokemonName);
  isPokemonDetailLoading.value = false;
  store.checkIsIdWithinSelectedGeneration(pokemonDetail.value.id);

  playPokemonCry(pokemonDetail.value.id);
  if (hoveredEvolutions.value && hoveredEvolutions.value.some((evolution: { name: string, url: string }) => evolution.name === pokemonName)) {
    pokemonEvolutions.value = hoveredEvolutions.value;
    isEvolutionsLoading.value = false;
    return;
  }
  isEvolutionsLoading.value = true; 
  pokemonEvolutions.value = await fetchPokemonEvolutions(pokemonName);

  isEvolutionsLoading.value = false;
};
</script>

<template>
  <div class="md:grid grid-cols-[auto,1fr] gap-4 h-full">
    <div class="fixed top-4 right-4 z-[20]">
      <el-alert
        v-if="showGuessAlert"
        title="Have you guessed today's Pokémon?"
        :closable="true"
        @close="showGuessAlert = false"
        class="shadow-lg rounded-xl border border-blue-100"
      >
        <template #default>
          <div class="flex justify-end mt-2 items-center">
            <el-button 
              @click="showGuessAlert = false"
              class="hover:bg-gray-100 transition-colors"
            >
              I have!
            </el-button>
            <el-button 
              type="primary" 
              @click="$router.push('/guess')"
              class="hover:bg-blue-600 transition-colors"
            >
              Guess Now!
            </el-button>
          </div>
        </template>
      </el-alert>
    </div>

    <PokeList
      @pokemon-clicked="onPokemonClicked"
      @hovered="onPokemonHovered"
    ></PokeList>
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
      <p v-else-if="isPokemonDetailLoading" class="w-full h-full text-lg md:text-xl text-slate-400 flex justify-center items-center">
        Loading...
      </p>
      <p v-else class="w-full h-full text-lg md:text-xl text-slate-400 flex justify-center items-center">
        Select a Pokémon
      </p>

      <div v-if="isEvolutionsLoading && !isPokemonDetailLoading" class="text-center text-slate-400 mt-8">
        Loading evolutions...
      </div>
      <div v-else-if="pokemonEvolutions.length" class="mt-8">
        <PokeEvolutions
          :pokemon-evolutions="pokemonEvolutions"
          @pokemon-clicked="onPokemonClicked"
        />
      </div>
    </div>
  </div>
</template>