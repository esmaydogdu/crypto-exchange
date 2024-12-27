<script setup lang="ts">
import { ref, computed} from 'vue' 
import{ Dropdown } from '@/components'
import { useFetchOrders } from '@/composables'

const { markPrice, sellOrders, buyOrders, groupSize } = useFetchOrders();

const groupSizes = ref<number[]>([0, 1, 10, 100])

const groupSizeOptions = computed(() => {
  return groupSizes.value.map(size => {
    return {
      value: size,
      label: size.toString()
    }
  })
})

const formatPrice = (price: number) => {
  return groupSize.value ? price : price.toFixed(2)
}
const formatDecimals = (number: number, decimalCount: number) => {
  return number.toFixed(decimalCount)
}

</script>
<template>
  <div>
    <div class="row">
      <strong>Dummy Coin OrderBook</strong>
      <Dropdown
        :options="groupSizeOptions"
        v-model="groupSize"
      />
    </div>
    <div class="row orders-header">
      <div>Price(EUR)</div>
      <div>Quantity(DummyCoin)</div>
      <div>Total(DummyCoin)</div>
    </div>
    <div>
      <div class="orders orders--sell">
        <div v-for="(order, id) in sellOrders" :key="id" @click="$emit('row-click', order)" class="row order">
          <div>{{ formatPrice(order.price) }} </div>
          <div>{{ formatDecimals(order.amount, 2) }}</div>
          <div>{{ formatDecimals(order.total, 2) }}</div>
        </div>
      </div>
      <div class="row orders-mark-price"> MARK: {{ markPrice }}</div>
      <div class="orders orders--buy">
        <div v-for="(order, id) in buyOrders" :key="id" @click="$emit('row-click', order)" class="row order">
          <div>{{ formatPrice(order.price) }} </div>
          <div>{{ formatDecimals(order.amount, 2) }}</div>
          <div>{{ formatDecimals(order.total, 2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.order {
  padding: 0 4px;
  border-bottom: 1px solid $color-electric-hover;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  transition: 0.2 background-color ease;
  cursor: pointer;

  &:hover {
    background-color: $color-black-mute;
  }
  >* {
    flex: 1;
  }
}
.orders-mark-price {
  color: $color-white;
  line-height: 36px;
  font-weight: bold;
  justify-content: flex-end;
  padding: 0 8px;
  background-color: $color-electric;
}
.orders-header {
  margin-top: 24px;
  top: 0;
  position: sticky;
  background-color: $color-black;
  line-height: 36px;
  border-radius: $border-radius;
  border: 1px solid $color-electric;
  padding: 0 4px;
  >* {
    flex: 1;
    font-weight: bold;
  }
}
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
  max-height: 300px;
  overflow-y: scroll;

  p {
    line-height: 30px;
    font-size: 18px;
  }
}
</style>
