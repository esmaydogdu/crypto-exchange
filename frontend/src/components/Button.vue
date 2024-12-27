<template>
  <button
    v-bind="$attrs"
    :disabled="isDisabled"
    class="button"
    :class="{'button--disabled': isDisabled}"
  >
    {{ label }}
  </button>
</template>
<script setup lang="ts">

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
});

</script>
<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.button {
  padding: 6px 12px;
  color: $color-white;
  background-color: $color-electric;
  border-radius: 2px;
  transition: 0.2s all ease;
  border: none;
  cursor: pointer;
  
  &:not(&--disabled):hover,
  &:not(&--disabled):focus,
  &:not(&--disabled):active{
    background-color: $color-electric-hover;
  }

  &--disabled {
    background-color: $color-placeholder;
    cursor: no-drop;
  }
  
}
</style>
