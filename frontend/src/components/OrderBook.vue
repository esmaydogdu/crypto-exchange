<script setup lang="ts">
import { ref } from 'vue' 
import { useFetchOrders } from '@/composables'

const { markPrice, sellOrders, buyOrders, groupSize } = useFetchOrders();

const groupSizes = ref<number[]>([0, 1, 10, 100])

const formatPrice = (price: number) => {
  return groupSize.value ? price : price.toFixed(2)
}
const formatDecimals = (number: number, decimalCount: number) => {
  return number.toFixed(decimalCount)
}

</script>
<template>
  <div>
    <select id="group-sizes" v-model="groupSize">
        <option v-for="size in groupSizes" :value="size">{{size}}</option>
    </select>
    <div>
      <div class="orders pink">
        <p v-for="(order, id) in sellOrders" :key="id" @click="$emit('row-click', order)">
          {{ order.side }} // {{ formatPrice(order.price) }} // {{ formatDecimals(order.amount, 2) }} // {{ formatDecimals(order.total, 2) }}
        </p>
      </div>
      <div> {{ markPrice }}</div>
      <div class="orders blue">
        <p v-for="(order, id) in buyOrders" :key="id" @click="$emit('row-click', order)">
          {{ order.side }} // {{ formatPrice(order.price) }} // {{ formatDecimals(order.amount, 2) }} // {{ formatDecimals(order.total, 2) }}
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pink {
  background-color: pink;
  color: black;
}

.blue {
  background-color: blue;
}

.orders {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  width: 1000px;
  overflow-y: scroll;

  p {
    line-height: 30px;
    font-size: 18px;
  }
}
</style>
