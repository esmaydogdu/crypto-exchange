<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { useWebSocket } from './composables/useWebSocket'

const messages = ref<string[]>([])
const { orders, markPrice } = useWebSocket()

let socket: WebSocket;

onMounted(() => {
})


</script>

<template>
  <div>
    <HelloWorld msg="I did it!" />
    <div class="test2">hihihi</div>
    <div class="test">
      <div class="test2">{{ markPrice }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test {
  .test2 {
    color: red
  }
}
</style>
