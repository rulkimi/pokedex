<script setup lang="ts">
const props = defineProps<{
  pokemonDetail: PokemonDetail,
  isMobileView: boolean,
}>();

const emit = defineEmits(['go-back', 'image-clicked'])

const arrangedTypes = computed(() => formatAndArrangeType(props.pokemonDetail.types));

const imageShakeClass = ref('');
const shakeTimeout = ref();
const scaleTimeout = ref();

const store = useMainStore();

const getRandomShakeType = () => {
  const shakeTypes = [
    'shake-1', 'shake-2', 'shake-3', 'shake-4', 
    'shake-5', 'shake-6', 'shake-7', 'shake-8',
    'shake-9', 'shake-10'
  ];
  const randomIndex = Math.floor(Math.random() * shakeTypes.length);
  return shakeTypes[randomIndex];
};

const getRandomScale = () => {
  return Math.random() > 0.5 ? 'scale-animation' : '';
};

onMounted(() => {
  getAnimationClasses();
});

const getAnimationClasses = () => {
  imageShakeClass.value = `${getRandomShakeType()} ${getRandomScale()}`;

  if (shakeTimeout.value) clearTimeout(shakeTimeout.value);
  if (scaleTimeout.value) clearTimeout(scaleTimeout.value);

  shakeTimeout.value = setTimeout(() => {
    imageShakeClass.value = '';
  }, 1000); 

  // optionally reset the scale after 1 second if applied
  if (imageShakeClass.value.includes('scale-animation')) {
    scaleTimeout.value = setTimeout(() => {
      imageShakeClass.value = imageShakeClass.value.replace('scale-animation', '');
    }, 1000);
  }
}

watch(() => store.activePokemon, () => {
  getAnimationClasses();
});
</script>

<template>
  <div v-if="pokemonDetail">
    <div class="flex items-center justify-between">
      <el-button
        v-if="isMobileView"
        :icon="ElIconArrowLeft"
        class="mr-2"
        @click="emit('go-back')"
      >
        Back
      </el-button>
      <span class="text-2xl md:text-4xl text-gray-500">
        {{ '#' + formatIndex(pokemonDetail.id) }}
      </span>
      <span
        class="text-2xl md:text-4xl font-bold flex-grow text-end"
        v-html="formatName(pokemonDetail.name)"
      ></span>
    </div>

    <div class="flex justify-center">
      <div
        class="relative flex justify-center items-center group cursor-pointer w-fit"
        @click="emit('image-clicked', pokemonDetail.id)"
      >
        <NuxtImg
          :src="pokemonDetail.sprites.front_default"
          :alt="`Image of ${pokemonDetail.name}`"
          class="object-cover group-hover:scale-125 transition-transform duration-300"
          :class="imageShakeClass"
          width="200"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <div :class="`shadow-inner w-40 h-40 bg-${getTypeColor(arrangedTypes[0])}/5 group-hover:bg-${getTypeColor(arrangedTypes[0])}/20 transition-colors duration-300 rounded-full z-[-1]`"></div>
        </div>
      </div>
    </div>

    <h2 class="text-lg md:text-xl text-start font-bold mb-2">Base Stats</h2>

    <div
      v-for="stat in pokemonDetail.stats"
      :key="stat.stat.name"
      class="flex items-center -mr-2 font-semibold"
    >
      <div class="flex-none text-start md:w-1/6 sm:w-1/5 text-xs md:text-sm w-[50px]">{{ formatStat(stat.stat.name) }}</div>
      <div class="flex-grow bg-gray-200 rounded-full h-3 md:h-4">
        <div
          class="flex justify-center bg-blue-600 h-3 md:h-4 rounded-full text-white text-xxs md:text-xs"
          :style="{ width: getStatWidth(stat) + '%' }"
        ></div>
      </div>
      <div class="w-12 flex justify-center">{{ stat.base_stat }}</div>
    </div>

    <div class="flex items-center justify-end mt-2 -mr-1 gap-4">
      <span class="font-semibold">TOTAL STATS: </span>
      <span class="px-2 py-1 rounded-full bg-blue-600 text-white ">
        {{ getTotalStats(pokemonDetail.stats) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake-1 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-5px, 5px); }
  50% { transform: translate(5px, -5px); }
  75% { transform: translate(-5px, -5px); }
  100% { transform: translate(0, 0); }
}

@keyframes shake-2 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-10px, 10px); }
  50% { transform: translate(10px, -10px); }
  75% { transform: translate(-10px, -10px); }
  100% { transform: translate(0, 0); }
}

@keyframes shake-3 {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

@keyframes shake-4 {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes shake-5 {
  0% { transform: translate(0, 0); }
  30% { transform: translate(-15px, 15px); }
  60% { transform: translate(15px, -15px); }
  100% { transform: translate(0, 0); }
}

@keyframes shake-6 {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-10deg); }
  40% { transform: rotate(10deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}

@keyframes shake-7 {
  0% { transform: translate(0, 0); }
  50% { transform: translate(20px, -10px); }
  100% { transform: translate(0, 0); }
}

@keyframes shake-8 {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-10px, 0); }
  40% { transform: translate(10px, 0); }
  60% { transform: translate(-10px, 0); }
  80% { transform: translate(10px, 0); }
  100% { transform: translate(0, 0); }
}

@keyframes shake-9 {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.8); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes shake-10 {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(5deg); }
  20% { transform: rotate(-5deg); }
  30% { transform: rotate(5deg); }
  40% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

@keyframes scale-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.shake-1 {
  animation: shake-1 1s ease-in-out;
}

.shake-2 {
  animation: shake-2 1s ease-in-out;
}

.shake-3 {
  animation: shake-3 1s ease-in-out;
}

.shake-4 {
  animation: shake-4 1s ease-in-out;
}

.shake-5 {
  animation: shake-5 1s ease-in-out;
}

.shake-6 {
  animation: shake-6 1s ease-in-out;
}

.shake-7 {
  animation: shake-7 1s ease-in-out;
}

.shake-8 {
  animation: shake-8 1s ease-in-out;
}

.shake-9 {
  animation: shake-9 1s ease-in-out;
}

.shake-10 {
  animation: shake-10 1s ease-in-out;
}

.scale-animation {
  animation: scale-animation 1s ease-in-out;
}
</style>

