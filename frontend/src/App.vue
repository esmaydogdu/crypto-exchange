<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { useWebSocket } from './composables/useWebSocket'

const messages = ref<string[]>([])
const { markPrice, buyOrders, sellOrders } = useWebSocket()

</script>

<template>
  <div>
    <HelloWorld msg="I did it!" />
    <div>
      <div class="orders pink">
        <p v-for="(order, id) in sellOrders" :key="id">
          {{ order.side }} // {{ order.price }} // {{ order.amount }} // {{ order.total }}
        </p>
      </div>
      <div> {{ markPrice }}</div>
      <div class="orders blue">
        <p v-for="(order, id) in buyOrders" :key="id">
          {{ order.side }} // {{ order.price }} // {{ order.amount }} // {{ order.total }}
        </p>
      </div>
    </div>
    <div class="test">
      <div class="test2">{{ markPrice }}</div>
    </div>
  </div>
</template>
13.93746453208724 
28.39789432312574
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
