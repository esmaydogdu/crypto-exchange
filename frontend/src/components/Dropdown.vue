<template>
  <div class="dropdown-container" ref="dropdownContainer">
    <Button
      :aria-expanded="isOpen"
      :label="computedLabel"
      @click="toggleDropdown"  
    />
    <ul v-if="isOpen" class="dropdown-menu">
      <li
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        :class="{'dropdown-item--selected': option.value === modelValue}"
      >
        <a
          @click.prevent="selectOption(option)"
          :aria-selected="option.value === modelValue ? 'true' : 'false'"
          role="option"
          tabindex="0"
        >
          {{ option.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

type Option = { 
  label: string; 
  value: string | number; 
};

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array as () => Option[],
    required: true,
    validator(value: Option[]) {
      return value.every(
        option => 
          typeof option.label === 'string' && 
          (typeof option.value === 'string' || typeof option.value === 'number')
      );
    },
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === props.modelValue);
  return selectedOption ? selectedOption.label : props.placeholder;
});


const computedLabel = computed(() => {
  const label = selectedLabel.value || props.placeholder;
  return isOpen.value ? label + ' ▲' : label + ' ▼';
});

const dropdownContainer = ref<HTMLElement | null>(null);

const toggleDropdown = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectOption = async (option: Option) => {
  emit('update:modelValue', option.value);
  await nextTick();
  closeDropdown();
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside) 
});
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2;
  margin: 4px 0;
  padding: 0;
  background-color: $color-black-mute;
  border: 1px solid $color-dark-border;
  border-radius: $border-radius;
  list-style: none;
  max-height: 500px;
  overflow-y: auto;
}

.dropdown-item {
  color: $color-white;
  padding: 4px;
  a {
    display: block;
    width: 100%;
    text-decoration: none;
    padding: 8px 12px;
    cursor: pointer;

    &:focus {
      outline: 2px solid $color-electric;
      outline-offset: 2px;
    }

    &:hover {
      background-color: $color-electric;
    }
  }

  &--selected a {
    background-color: $color-electric-hover;
  }
}
</style>
