<script setup lang="ts">
const { fetchPokemons, fetchPokemonDetails } = usePokemons();

const store = useMainStore();
// const { data: pokemons, refresh } = useAsyncData('pokemons', () => fetchPokemons(store.selectedGeneration));
const pokemons = ref<PokemonResponse[]>();

onMounted(async () => {
  await getPokemons();
})

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
</script>

<template>
  <div class="relative">
    <div class="sticky top-0 z-10 w-full">
      <div class="flex">
        <FormInput
          v-model="searchPokemon"
          placeholder="Search Pokemon"
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
      class="flex flex-col gap-1 mt-4 min-h-[calc(100vh-120px)] w-fit overflow-y-auto overflow-x-hidden"
    >
      <PokeCard
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        :index="pokemons?.findIndex(p => p.name === pokemon.name) + 1 + store.generationLimits[1].offset"
        :name="pokemon.name"
        :types="pokemon.types"
        :image="pokemon.image"
        @mouseover="onHover(pokemon.name)"
      />
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
</style>