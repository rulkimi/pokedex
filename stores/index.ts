export const useMainStore = defineStore('main', () => {
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

  return {
    generationLimits,
  };
});