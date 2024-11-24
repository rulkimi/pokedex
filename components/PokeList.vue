<script setup lang="ts">
const { fetchPokemons, fetchPokemonDetails } = usePokemons();

const store = useMainStore();
// const { data: pokemons, refresh } = useAsyncData('pokemons', () => fetchPokemons(store.selectedGeneration));
const pokemons = ref<PokemonResponse[]>();

const emit = defineEmits(['pokemon-clicked'])

onMounted(async () => {
  await getPokemons();
});

watch(() => store.selectedGeneration, async (newVal) => {
  await getPokemons();
  // scrollToPokemon(store.activePokemon);
});

// const scrollToPokemon = async (pokemonName: string) => {
//   await nextTick();
//   const element = document.getElementById('scrollId-' + pokemonName);
//   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
// };

const getPokemons = async () => {
  pokemons.value = await fetchPokemons(store.selectedGeneration);
}

const onHover = async (pokemonName: string) => {
  // if (!pokemons.value) return;
  // const pokemonIndex = pokemons.value.findIndex(p => p.name === pokemonName) + 1 + store.generationLimits[1].offset;
  const data = await fetchPokemonDetails(pokemonName);
  console.log(data);
}

const searchPokemon = ref('');

const filteredPokemons = computed(() => {
  if (!searchPokemon.value) return pokemons.value;
  if (!pokemons.value) return;
  return pokemons.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchPokemon.value.toLowerCase())
  );
});

const onGenerationChanged = async (generation: number) => {
  store.setSelectedGeneration(generation);
  await getPokemons();
}

const debounceTimeout = ref();
// const searchError = ref(false);

const searchOutOfGenPokemon = (value: string) => {
  if (filteredPokemons.value?.length) return;

  store.setIsSearchingPokemon(true);

  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(async () => {
    try {
      if (!value) return;
      // searchError.value = false;

      const pokemonDetails = await fetchPokemonDetails(value.toLowerCase());
      if (!pokemonDetails || !pokemonDetails.id) {
        console.warn('Pokemon not found!');
        // searchError.value = true;
        return;
      }

      store.checkIsIdWithinSelectedGeneration(pokemonDetails.id);

      await getPokemons();

      await nextTick();
      // store.setActivePokemon(pokemonDetails.name);
      // const element = document.getElementById(`scrollId-${pokemonDetails.name}`);
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      //   store.setActivePokemon(pokemonDetails.name); // Optionally set as active Pokémon
      // }

    } catch (error) {
      console.error('Error during Pokémon search:', error);
      // searchError.value = true;
    } finally {
      store.setIsSearchingPokemon(false);
      // searchError.value = false;
    }
  }, 1000); // Adjust the debounce delay (1000ms in this example)
};



</script>

<template>
  <div>
    <div class="sticky top-0 z-10 w-full">
      <div class="flex">
        <FormInput
          v-model="searchPokemon"
          placeholder="Search Pokemon"
          @input="searchOutOfGenPokemon"
        />
        <FormSelect
          v-model="store.selectedGeneration"
          :options="store.generations"
          @change="onGenerationChanged"
        />
      </div>
    </div>
    <transition-group
      name="list"
      tag="ul"
      class="flex flex-col gap-1 mt-4 h-[calc(100vh-120px)] w-[300px] overflow-y-auto overflow-x-hidden scrollbar-gutter"
    >
      <PokeCard
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        :id="'scrollId-' + pokemon.name"
        :index="pokemons?.findIndex(p => p.name === pokemon.name) + 1 + store.generationLimits[1].offset"
        :name="pokemon.name"
        :types="pokemon.types"
        :image="pokemon.image"
        :is-active="store.activePokemon === pokemon.name"
        @mouseover="onHover(pokemon.name)"
        @click="emit('pokemon-clicked', pokemon.name)"
      />
      <div v-show="!filteredPokemons?.length && store.isSearchingPokemon" class="px-4 flex flex-col" key="loading-pokemon">
        <div class="h-[100px]" v-loading="true"></div>
        <span class="w-full text-center animate-pulse">
          searching for {{ searchPokemon }}...
        </span>
      </div>
      <div v-if="!filteredPokemons?.length && !store.isSearchingPokemon" key="pokemon-not-found">
        Pokemon named {{ searchPokemon }} not found!
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.list-leave-active {
  position: absolute;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-move {
  transition: transform 0.3s ease-in-out;
}

::-webkit-scrollbar {
  width: 3px;
}

.scrollbar-gutter {
  scrollbar-gutter: stable;
}
</style>