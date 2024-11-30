<script setup lang="ts">
const { fetchPokemonDetails } = usePokemons();

const pokemon = ref<any>(null);

const getRandomPokemonIndex = () => {
  const date = new Date();
  const dayOfYear = Math.floor((date.getTime() / (1000 * 60 * 60 * 24)) % 365);
  return dayOfYear;
};

const fetchRandomPokemon = async () => {
  const index = getRandomPokemonIndex();
  pokemon.value = await fetchPokemonDetails(index);
};

const guess = ref();
const correct = ref(false);
const guessImage = ref();

const startGuess = () => {
  if (guess.value === pokemon.value.name) {
    correct.value = true;
  }
}

onMounted(() => {
  fetchRandomPokemon();
});
</script>

<template>
  <div v-if="pokemon" class="flex flex-col items-center justify-center text-center h-screen">
    <h1 class="text-3xl font-bold mb-4">Guess that Pokémon!</h1>
    <el-input v-model="guess"></el-input>
    <el-button @click="startGuess">Guess</el-button>
    <NuxtImg
      ref="guessImage"
      :src="pokemon.sprites.front_default"
      alt="guess pokemon"
      :class="{ 'guess-pokemon' : !correct }"
      class="object-cover group-hover:scale-125 transition-transform duration-300"
      width="500"
    />
  </div>
  <div v-else class="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
</template>
