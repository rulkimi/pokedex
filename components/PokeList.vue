<script setup lang="ts">
const { fetchPokemons } = usePokemons();

const { data: pokemons } = useAsyncData('pokemons', () => fetchPokemons(1));
const store = useMainStore();
</script>

<template>
  <transition-group
    name="list"
    tag="ul"
    class="flex flex-col gap-1 mt-4 h-[calc(100vh-120px)] w-fit overflow-y-auto overflow-x-hidden"
  >
    <PokeCard
      v-for="pokemon in pokemons"
      :key="pokemon.name"
      :index="pokemons?.findIndex(p => p.name === pokemon.name) + 1 + store.generationLimits[1].offset"
      :name="pokemon.name"
      :types="pokemon.types"
      :image="pokemon.image"
    />
  </transition-group>
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