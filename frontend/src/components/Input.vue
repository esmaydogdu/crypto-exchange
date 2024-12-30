<template>
    <div class="input-container">
      <div v-if="label" class="label">{{ label }}</div>
      <input 
        v-model="internalValue" 
        :placeholder="placeholder" 
        class="input"
      />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: ''
  }
});
const internalValue = ref(props.modelValue)

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})

</script>
<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.input-container {
  .label {
    color: $color-placeholder;
    padding-bottom: 4px;
  }
  .input {
    padding: $box-padding;
    width: 100%;
    background-color: $color-black-mute;
    border: 1px solid $color-dark-border;
    border-radius: $border-radius;
    color: $color-white;
  
    &:focus, &:active {
      outline: none;
      border-color: $color-electric;
    }
  }
}

</style>
