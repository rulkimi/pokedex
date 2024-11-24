export const useMainStore = defineStore('main', () => {
  const generations = ref([
    { label: 'Gen 1', value: 1 },
    { label: 'Gen 2', value: 2 },
    { label: 'Gen 3', value: 3 },
    { label: 'Gen 4', value: 4 },
    { label: 'Gen 5', value: 5 },
    { label: 'Gen 6', value: 6 },
    { label: 'Gen 7', value: 7 },
    { label: 'Gen 8', value: 8 },
    { label: 'Gen 9', value: 9 },
  ]);
  const generationLimits = ref({
    1: { limit: 151, offset: 0 }, // Generation 1
    2: { limit: 100, offset: 151 }, // Generation 2
    3: { limit: 135, offset: 251 }, // Generation 3
    4: { limit: 107, offset: 386 }, // Generation 4
    5: { limit: 156, offset: 493 }, // Generation 5
    6: { limit: 72, offset: 649 }, // Generation 6
    7: { limit: 88, offset: 721 }, // Generation 7
    8: { limit: 96, offset: 809 }, // Generation 8
    9: { limit: 120, offset: 905 }, // Generation 9
  });

  const selectedGeneration = ref(1);
  const activePokemon = ref('');

  const setSelectedGeneration = (generation: number) => {
    selectedGeneration.value = generation;
  }

  const setActivePokemon = (pokemonName: string) => {
    activePokemon.value = pokemonName;
  }

  const checkIsIdWithinSelectedGeneration = (id: number) => {
    if (!id) return; // Exit if no ID is provided
    
    // Loop through each generation's limits to find where the ID fits
    for (const [generation, { limit, offset }] of Object.entries(generationLimits.value)) {
      const startRange = offset + 1; // Generation's starting ID
      const endRange = offset + limit; // Generation's ending ID
      
      if (id >= startRange && id <= endRange) {
        // If ID is within the range, update the selected generation
        setSelectedGeneration(Number(generation));
        break;
      }
    }
  };

  const isSearchingPokemon = ref(false);
  
  const setIsSearchingPokemon = (status: boolean) => {
    isSearchingPokemon.value = status;
  }


  return {
    generations,
    generationLimits,
    selectedGeneration,
    setSelectedGeneration,
    activePokemon,
    setActivePokemon,
    checkIsIdWithinSelectedGeneration,
    isSearchingPokemon,
    setIsSearchingPokemon,
  };
});