<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { type OrderFormData } from '@/types'
import { useOrderForm } from "@/composables";
import { Input, Button, Dropdown } from "@/components";

const { orderStatus, placeOrder } = useOrderForm();

const props = defineProps({
  modelValue: {
    type: Object as PropType<OrderFormData>,
    required: true
  }
})
const isFormValid = computed(() => {
  return props.modelValue.price !== null && props.modelValue.amount !== null && props.modelValue.side !== null;
});

const resetForm = () => {
  props.modelValue.price = null;
  props.modelValue.amount = null;
  props.modelValue.side = null;
};

const clearStatus = () => {
  orderStatus.value = null;
}


const handleSubmit = async () => {
  console.log('sana noluyo haci')
  if (!isFormValid.value) {
    orderStatus.value = "Invalid formData values!";
    return;
  }
  orderStatus.value = "Placing order...";
  await placeOrder(props.modelValue);
  resetForm()
  setTimeout(() => {
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
          v-model="modelValue.side"
          :options="[{ label: 'Buy', value: 'buy'}, { label: 'Sell', value: 'sell'}]"
        />
      </div>
      <div class="row">
        <Input 
          v-model="modelValue.price"
          placeholder="Enter price per coin"
          label="Price"
          class="row-element"
        />
        <Input
          v-model="modelValue.amount"
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
    &:not(:last-child) {
      margin-right: 12px;
    }
  }
}
.order-status {
  height: 20px;
}
</style>
