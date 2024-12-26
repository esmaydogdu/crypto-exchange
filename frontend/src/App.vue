<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { useWebSocket } from './composables/useWebSocket'

const groupSizes = ref<number[]>([0, 1, 10, 100])
const { markPrice, buyOrders, sellOrders, groupSize } = useWebSocket()

const formatPrice = (price: number) => {
  return groupSize.value ? price : price.toFixed(2)
}
const formatDecimals = (number: number, decimalCount: number) => {
  return number.toFixed(decimalCount)
}
</script>

<template>
  <div>
    <HelloWorld msg="I did it!" />
    <label for="group-size">Choose a flavor:</label>
    <input list="group-sizes" id="group-size" name="group-size" />
    
    <select id="group-sizes" v-model="groupSize">
        <option v-for="size in groupSizes" :value="size">{{size}}</option>
    </select>
    <div>
      <div class="orders pink">
        <p v-for="(order, id) in sellOrders" :key="id">
          {{ order.side }} // {{ formatPrice(order.price) }} // {{ formatDecimals(order.amount, 2) }} // {{ formatDecimals(order.total, 2) }}
        </p>
      </div>
      <div> {{ markPrice }}</div>
      <div class="orders blue">
        <p v-for="(order, id) in buyOrders" :key="id">
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
