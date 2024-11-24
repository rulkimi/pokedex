<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>();

const emit = defineEmits(['update:modelValue', 'input']);

const handleChange = (value: string | number) => {
  emit('update:modelValue', value);
  emit('input', value);
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