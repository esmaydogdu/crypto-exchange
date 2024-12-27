<script setup lang="ts">
import { reactive } from 'vue'
import { OrderBook, OrderForm } from '@/components'
import { type Order, OrderSide } from '@/types'

const formData = reactive({
  price: null as number | null,
  amount: null as number | null,
  side: null as OrderSide | null,
});

const handleRowClick = (data: Order) => {
  formData.price = data.price
  formData.amount = data.amount
  formData.side = data.side
}
</script>

<template>
  <div class="main-container">    
    <OrderForm v-model="formData" class="order-form"/>
    <OrderBook @row-click="handleRowClick" class="order-book"/>
  </div>
</template>
<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 32px auto;

  .order-form {
    flex: 1;
    min-width: 400px;
    margin-bottom: 32px;
  }
  .order-book {
    flex: 1;
    min-width: 450px;
  }
}
.main-container > *:nth-child(1) {
    flex-direction: column-reverse;  // Form comes on top after wrapping
  }
</style>
