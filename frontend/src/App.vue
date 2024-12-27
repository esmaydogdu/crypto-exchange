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
  <div>    
    <OrderForm v-model="formData" />
    <OrderBook @row-click="handleRowClick" />
  </div>
</template>

