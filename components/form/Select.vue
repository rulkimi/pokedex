<script setup lang="ts">
const props = defineProps<{
  options: {
    label: string
    value: string | number
  }[]
  modelValue: string | number
  inputStyles?: object
}>();

const emit = defineEmits(['update:modelValue', 'change']);

function handleChange(value: string | number) {
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <el-select
    :model-value="modelValue"
    placeholder="Select"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
