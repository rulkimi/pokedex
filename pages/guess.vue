<script setup lang="ts">
const { fetchPokemonDetails } = usePokemons();

const pokemon = ref<any>(null);
const guess = ref('');
const correct = ref(false);
const hasGuessed = ref(false);

const getRandomPokemonIndex = () => {
  const date = new Date();
  const dayOfYear = Math.floor((date.getTime() / (1000 * 60 * 60 * 24)) % 365);
  return dayOfYear;
};

const getAnotherPokemonIndex = () => {
  return Math.floor(Math.random() * 898) + 1;
};

const fetchRandomPokemon = async () => {
  correct.value = false;
  hasGuessed.value = false;
  guess.value = '';
  const index = getRandomPokemonIndex();
  pokemon.value = await fetchPokemonDetails(index);
};

const fetchAnotherPokemon = async () => {
  correct.value = false;
  hasGuessed.value = false;
  guess.value = '';
  const index = getAnotherPokemonIndex();
  pokemon.value = await fetchPokemonDetails(index);
};

const startGuess = () => {
  if (!pokemon.value) return;
  hasGuessed.value = true;
  correct.value = guess.value.trim().toLowerCase() === pokemon.value.name.toLowerCase();
};

onMounted(() => {
  fetchRandomPokemon();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
    <div class="max-w-xl w-full space-y-6 bg-white p-6 rounded-2xl shadow-md border">
      <div class="py-2 flex w-full justify-start">
        <el-button type="info" plain @click="$router.push('/')"><< Back to Pokédex</el-button>
      </div>
      <div class="flex justify-center items-center">
        <h1 class="text-4xl font-extrabold text-gray-800">Guess that Pokémon!</h1>
      </div>

      <NuxtImg
        v-if="pokemon"
        :src="pokemon.sprites.front_default"
        alt="Guess Pokémon"
        :class="[
          'mx-auto transition-all duration-500',
          correct ? 'opacity-100 scale-125' : 'brightness-0 scale-110',
          'w-48 h-48 object-contain'
        ]"
      />

      <div class="flex items-center gap-4 justify-center">
        <el-input
          v-model="guess"
          placeholder="Enter Pokémon name"
          size="large"
          @keyup.enter="startGuess"
          class="w-64"
        />
        <el-button type="primary" size="large" @click="startGuess">Guess</el-button>
      </div>

      <div v-if="hasGuessed" class="text-lg font-medium">
        <p v-if="correct" class="text-green-600">🎉 Correct! It's {{ pokemon.name }}!</p>
        <p v-else class="text-red-600">❌ Nope! Try again.</p>
      </div>

      <div class="flex justify-center">
        <el-button type="success" plain @click="fetchRandomPokemon">Today's Pokémon</el-button>
        <el-button type="primary" plain @click="fetchAnotherPokemon">Guess Another Pokémon</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brightness-0 {
  filter: brightness(0);
}
</style>
