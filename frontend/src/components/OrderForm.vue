<script setup lang="ts">
import { computed, type PropType, ref, watch} from 'vue'
import { type OrderFormData } from '@/types'
import { useOrderForm } from "@/composables";
import { Input, Button, Dropdown } from "@/components";

const { orderStatus, placeOrder } = useOrderForm();
const emit = defineEmits(['reset', 'update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Object as PropType<OrderFormData>,
    required: true
  }
})
const internalFormData = ref({...props.modelValue})

const isFormValid = computed(() => {
  return internalFormData.value.price !== null && 
    internalFormData.value.amount !== null && 
    internalFormData.value.side !== null;
});

// Update internal value
watch(
  () => props.modelValue,
  (newValue) => {
    console.log('here with the new prop', newValue)
    internalFormData.value = { ...newValue }; 
  },
  { immediate: true, deep: true }
);
// Emit internal value change
watch(internalFormData, (newValue) => {
  emit('update:modelValue', newValue);  
});

const resetForm = () => {
  internalFormData.value = {
    price: null,
    amount: null,
    side: null,
  };
};

const clearStatus = () => {
  orderStatus.value = null;
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    orderStatus.value = "Invalid formData values!";
    return;
  }
  orderStatus.value = "Placing order...";
  await placeOrder(internalFormData.value);
  setTimeout(() => {
    resetForm()
    clearStatus();
  }, 2000)
};
</script>

<template>
  <div class="entry-form">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <Dropdown
          placeholder="Order side"
          v-model="internalFormData.side"
          :options="[{ label: 'Buy', value: 'buy'}, { label: 'Sell', value: 'sell'}]"
        />
      </div>
      <div class="row">
        <Input 
          v-model="internalFormData.price"
          placeholder="Enter price per coin"
          label="Price"
          class="row-element"
        />
        <Input
          v-model="internalFormData.amount"
          placeholder="Enter amount"
          label="Amount"
          class="row-element"
        />
      </div>
      <div class="row order-status">
        {{ orderStatus }}
      </div>
      <div class="row">
        <Button 
          type="submit"
          label="Place Order"
          :is-disabled="!isFormValid"  
          class="row-element"
        />
        <Button 
          label="Reset"
          @click="resetForm"
          class="row-element"
        />
      </div>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  
  .row-element { 
    flex: 1;
    &:not(:last-child) {
      margin-right: 12px;
    }

    &button {
      flex: 1;
    }
  }
}
</style>
