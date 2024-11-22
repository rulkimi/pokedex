<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>();

const emit = defineEmits(['update:modelValue']);

function handleChange(value: string | number) {
  emit('update:modelValue', value);
}
</script>

<template>
  <el-input
    :model-value="modelValue"
    :prefix-icon="ElIconSearch"
    :placeholder="placeholder"
    clearable
    @input="handleChange"
  >
  </el-input>
</template>