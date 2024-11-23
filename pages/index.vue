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

const onImageClicked = () => {

}

const { fetchPokemonDetails, fetchPokemonEvolutions } = usePokemons();
const onPokemonClicked = async (pokemonName: string) => {
  pokemonDetail.value = await fetchPokemonDetails(pokemonName);
  pokemonEvolutions.value = await fetchPokemonEvolutions(pokemonName);

  console.log(pokemonEvolutions)
}

const data = await fetchPokemonEvolutions(1);
console.log(data)
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

      <div v-if="pokemonDetail && pokemonEvolutions.length">
        <PokeEvolutions :pokemon-evolutions="pokemonEvolutions" />
      </div>
    </div>
  </div>
</template>