<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useOrderForm } from "@/composables";
import { type OrderFormData } from '@/types'

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
      <div>
        <p>{{ orderStatus }}</p>
        <label for="price">Price (per BTC):</label>
        <input 
          id="price" 
          v-model="modelValue.price" 
          placeholder="Enter price per BTC" 
          required 
        />
      </div>

      <div>
        <label for="amount">Amount (ES):</label>
        <input 
          id="amount" 
          v-model="modelValue.amount" 
          placeholder="Enter amount" 
          required 
        />
      </div>

      <div>
        <label for="side">Order Type:</label>
        <select v-model="modelValue.side" required>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <button type="submit" :disabled="!isFormValid">Place Order</button>
      <button type="button" @click="resetForm">Reset</button>
    </form>
  </div>
</template>
