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

const shakeX = useCssVar('--shake-x', document.documentElement);
const shakeY = useCssVar('--shake-y', document.documentElement);
const shakeRotate = useCssVar('--shake-rotate', document.documentElement);

const getRandomValue = (min: number, max: number) => Math.random() * (max - min) + min;

const getAnimationClasses = () => {
  // Random shake properties
  shakeX.value = `${getRandomValue(-15, 15)}px`;
  shakeY.value = `${getRandomValue(-15, 15)}px`;
  shakeRotate.value = `${getRandomValue(-10, 10)}deg`;

  imageShakeClass.value = 'dynamic-shake';

  if (shakeTimeout.value) clearTimeout(shakeTimeout.value);
  if (scaleTimeout.value) clearTimeout(scaleTimeout.value);

  shakeTimeout.value = setTimeout(() => {
    imageShakeClass.value = '';
  }, 1000);

  if (Math.random() > 0.5) {
    imageShakeClass.value += ' scale-animation';
    scaleTimeout.value = setTimeout(() => {
      imageShakeClass.value = imageShakeClass.value.replace('scale-animation', '');
    }, 1000);
  }
};

onMounted(() => {
  getAnimationClasses();
});

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
.dynamic-shake {
  animation: dynamic-shake 1s ease-in-out;
}

@keyframes dynamic-shake {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: translate(var(--shake-x), var(--shake-y)) rotate(var(--shake-rotate));
  }
  50% {
    transform: translate(calc(-1 * var(--shake-x)), calc(-1 * var(--shake-y))) rotate(calc(-1 * var(--shake-rotate)));
  }
  75% {
    transform: translate(var(--shake-x), var(--shake-y)) rotate(var(--shake-rotate));
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
}

@keyframes scale-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.scale-animation {
  animation: scale-animation 1s ease-in-out;
}
</style>

