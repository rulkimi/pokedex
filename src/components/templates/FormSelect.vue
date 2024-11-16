<script setup>
import { ref, defineEmits, watch, computed, useSlots } from 'vue';

const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean, null],
    required: true
  },
  label: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: false
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  inputClass: {
    type: String,
    required: false
  },
  labelClass: {
    type: String,
    required: false
  },
  isBlock: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: 'w-full'
  },
  options: {
    type: Array,
    default: () => []
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  returnObject: {
    type: Boolean,
    default: false
  },
  noOptionsMessage: {
    type: String,
    default: 'No options available'
  },
  prefixDisplayValue: {
    type: String,
    default: null
  },
  suffixDisplayValue: {
    type: String,
    default: null
  }
});

const optionsOpen = ref(false);
const displayValue = ref('');
const optionsPositionClass = ref('mt-1');

watch(
  () => props.modelValue,
  (val) => {
    if (props.returnObject && typeof val === 'object') {
      displayValue.value = val[props.optionLabel];
    } else {
      const selectedOption = props.options.find(
        (option) => option[props.optionValue] === val
      );
      displayValue.value = selectedOption ? selectedOption[props.optionLabel] : val;
    }
  },
  { immediate: true }
);

const slots = useSlots();

const hasPrependIcon = computed(() => {
  return slots['prepend-icon'];
});

const hasAppendIcon = computed(() => {
  return slots['append-icon'];
});

const baseInputStyles = computed(() => {
  return [props.inputClass, props.width]
});

const conditionalInputStyles = computed(() => {
  return {
    'border': (props.error || props.errorMessage) && !props.readonly,
    'border-red-300': props.error || props.errorMessage,
    'opacity-50 cursor-not-allowed': props.disabled,
    'border-b break-words !bg-transparent': props.readonly,
    'rounded-lg px-3': !props.readonly,
    'pl-10': hasPrependIcon.value,
    'pr-10': hasAppendIcon.value,
  };
});

const toggleOptions = event => {
  optionsOpen.value = !optionsOpen.value;
  if (optionsOpen.value) {
    setOptionsPosition(event);
  }
}

const setOptionsPosition = event => {
  const buttonRect = event.target.getBoundingClientRect();
  const spaceAbove = buttonRect.top;
  const spaceBelow = window.innerHeight - buttonRect.bottom;

  const requiredSpace = (props.options.length || 1 ) * 50 + 10;

  if (spaceBelow < requiredSpace && spaceAbove > spaceBelow) {
    optionsPositionClass.value = 'mb-1 bottom-full';
    document.documentElement.style.setProperty('--translate-y', '10px');
  } else {
    optionsPositionClass.value = 'mt-1';
    document.documentElement.style.setProperty('--translate-y', '-10px');
  }
}

const updateValueByList = (value, label) => {
  displayValue.value = label;
  
  const selectedOption = props.options.find(option => 
    props.optionValue ? option[props.optionValue] === value : option === value
  );

  emit('update:modelValue', props.returnObject ? selectedOption : value);
  emit('change', props.returnObject ? selectedOption : value);
  optionsOpen.value = false;
}
</script>

<template>
  <fieldset :class="width">
    <div v-if="label" class="mb-2">
      <label
        :for="id"
        class="text-sm font-medium text-black/60 dark:text-white/60"
        :class="labelClass"
      >
        {{ label }}
      </label>
      <span v-if="required && !readonly" class="ml-1 text-red-500">*</span>
    </div>
    <div class="relative items-center" :class="isBlock ? 'flex' : 'inline-flex'">
      <div v-if="hasPrependIcon" class="absolute left-3 text-gray-500 z-10">
        <slot name="prepend-icon"></slot>
      </div>
      <div v-if="hasAppendIcon" class="absolute right-3 text-gray-500 z-10">
        <slot name="append-icon"></slot>
      </div>
      <div v-if="!readonly" class="relative w-full">
        <button
          @click="toggleOptions"
          :id="id"
          class="rounded-lg py-3 h-[40px] flex gap-3 justify-between items-center bg-white"
          :class="[
            baseInputStyles,
            conditionalInputStyles,
          ]"
          :disabled="disabled"
        >
          <div class="text-start truncate mt-1">
            <span v-if="displayValue">
              <span v-if="props.prefixDisplayValue">{{ props.prefixDisplayValue }}</span>
              <span class="text-black">{{ displayValue }}</span>
              <span v-if="props.suffixDisplayValue">suffixDisplayValue</span>
            </span>
            <span v-else class="text-gray-400">{{ placeholder }}</span>
          </div>
          <font-awesome-icon
            :icon="['fas', 'chevron-down']"
            class="transition-transform duration-200 text-black"
            :class="{
              'rotate-180': optionsOpen
            }"
            size="xs"
          />
        </button>
        <transition name="dropdown-fade">
          <div
            v-if="optionsOpen"
            class="absolute bg-white border shadow-lg w-full z-10 rounded-lg max-h-[200px] overflow-auto"
            :class="optionsPositionClass"
          >
            <div v-if="props.options.length === 0" class="p-3 h-[40px] flex justify-center items-center text-gray-500">
              {{ noOptionsMessage }}
            </div>
            <div
              v-else
              v-for="(option, index) in props.options"
              :key="optionValue ? option[optionValue] : option"
              class="p-3 h-[40px] cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              @click="updateValueByList(optionValue ? option[optionValue] : option, optionLabel ? option[optionLabel] : option)"
              :class="{
                'rounded-t-lg': index === 0, 
                'rounded-b-lg': index === options.length - 1
              }"
            >
              <span class="text-black">{{ optionLabel ? option[optionLabel] : option }}</span>
            </div>
          </div>
        </transition>
      </div>
      <input
        v-else
        :id="id"
        v-model="displayValue"
        class="block py-3 h-[40px] outline-none"
        :class="[
          baseInputStyles,
          conditionalInputStyles
        ]"
        readonly
        :disabled="disabled"
      >
    </div>
    <transition name="shake-fade">
      <small
        v-if="errorMessage"
        class="block text-red-400"
        :class="{ 'opacity-50' : disabled }"
      >
        {{ errorMessage }}
      </small>
    </transition>
  </fieldset>
</template>

<style scoped>
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
}

option {
    background: none;
    color: inherit;
}

.custom-bg-color {
    background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3));
}

.shake-fade-enter-active {
    animation: shake 0.5s ease;
}
.shake-fade-leave-active {
    transition: all 0.5s ease;
}
.shake-fade-enter-from, .shake-fade-leave-to {
    opacity: 0;
}

.dropdown-fade-enter-active, .dropdown-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.3s ease;
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(var(--translate-y));
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}
</style>
