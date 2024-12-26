<template>
  <div>
    <button class="tlx-button"></button>
    <div class="tlx-dropdown-menu"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, type PropType } from 'vue';

type Option = {
  label: string | number;
  value: string | number;
}

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => Option[],
    required: true
  },
  modelValue: {
    type: [Number, String] as PropType<number | string>,
    required: true
  }
});

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

// Refs
const selectedValue = ref(props.modelValue);

// Methods
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue.value = Number(target.value);
  emit('update:modelValue', selectedValue.value); // Emit update to modelValue
};

// // Emits
// const emit = defineEmits<{
//   (e: 'update:modelValue', value: string | number): void;
//   (e: 'update:selectedValue', value: string | number): void;
// }>();

// // Refs
// const selectedValue = ref(props.modelValue);

// // Methods
// const handleChange = (event: Event) => {
//   const target = event.target as HTMLSelectElement;
//   selectedValue.value = target.value;
//   emit('update:modelValue', selectedValue.value);
// };

// // Watchers
// watch(selectedValue, (newVal) => {
//   emit('update:selectedValue', newVal);
// });
</script>
