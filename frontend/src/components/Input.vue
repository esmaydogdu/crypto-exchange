<template>
    <input class="input" :placeholder="placeholder"/>
</template>

<script setup lang="ts">

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
});
</script>
<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.input {
  padding: 12px 16px;
  background-color: $bg-color-muted;
  border: 2px solid $color-grey;

  &:focus {
    border-color: $color-electric;
  }
}

</style>
