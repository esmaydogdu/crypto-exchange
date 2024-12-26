<template>
    <button class="button" @click="$emit('click')">{{ label }}</button>
</template>

<script setup lang="ts">

const props = defineProps({
  label: {
    type: String,
    required: true
  }
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

  &:hover, &:focus, &:active {
    background-color: $color-electric-hover;
  }
  
}
</style>
