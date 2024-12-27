import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { type Order, OrderSide, type GroupOrder } from "@/types";


export const useFetchOrders = () => {
  const orders = ref<Order[]>([]);
  const groupSize = ref<number>(10);
  const socket = ref<WebSocket | null>(null);

  const API_URL = import.meta.env.VITE_APP_API_URL;


  const buyOrders = computed(() => {
    const _buyOrders = groupOrders(orders.value, OrderSide.Buy)

    let cumulativeAmount = 0;
    return _buyOrders.map((order) => {
      cumulativeAmount += order.amount;
      return {
        ...order,
        total: cumulativeAmount,
      };
    });
  });

  const sellOrders = computed(() => {
    const _sellOrders = groupOrders(orders.value, OrderSide.Sell)

    let cumulativeAmount = 0;
    return _sellOrders.map((order: Order) => {
      cumulativeAmount += order.amount;
      return {
        ...order,
        total: cumulativeAmount,
      };
    });
  });

  const markPrice = computed(() => {
    const bestSellPrice = sellOrders.value[sellOrders.value.length - 1]?.price || 0;
    const bestBidPrice = buyOrders.value[0]?.price || 0;
    return (bestSellPrice + bestBidPrice) / 2;
  });

  const insertOrder = (order: Order) => {
    const existingOrderIndex = orders.value.findIndex((o) => o.id === order.id);
    if (existingOrderIndex !== -1) {
      orders.value[existingOrderIndex] = order;
    } else {
      orders.value.push(order);
    } 
    
    orders.value.sort((a, b) => b.price - a.price);
  };

  const deleteOrder = (orderId: string) => {
    orders.value = orders.value.filter((order) => order.id !== orderId);
  };

  
  // Grouping orders by side and groupSize
  const groupOrders = (orders: Order[], side: OrderSide): Order[] => {
    const groupedData: GroupOrder = {};
    
    const _orders = orders
    .filter((order) => order.side === side)
    .sort((a, b) => b.price - a.price);
    
    if (!groupSize.value) {
      return _orders
    }
    
    let cumulativeAmount = 0;
    _orders.forEach((order) => {
      // lower bound
      const bucket = Math.floor(order.price / groupSize.value) * groupSize.value;

      if (!groupedData[bucket]) {
        groupedData[bucket] = { amount: 0, id: order.id, side: order.side, price: bucket }; 
      }

      // total amount for all orders in the bucket
      groupedData[bucket].amount += order.amount;
      

      // aggregated amount for all orders
      cumulativeAmount += order.amount;
      groupedData[bucket].total = cumulativeAmount;
    });

    // Convert grouped data back to an array, sorted in descending order by price
    return Object.keys(groupedData)
      .map((key) => ({
        ...groupedData[Number(key)]
      }))
      .sort((a, b) => b.price - a.price);
  };

  const initializeWebSocket = () => {
    socket.value = new WebSocket(`ws://${API_URL}`);

    socket.value.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Initial batch
        if (data.existing) {
          data.existing.forEach((order: Order) => insertOrder(order));
        }

        // Insert orders
        if (data.insert) {
          data.insert.forEach((order: Order) => insertOrder(order));
        }

        // Delete orders
        if (data.delete) {
          data.delete.forEach((orderId: string) => deleteOrder(orderId));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.value.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  onMounted(() => {
    initializeWebSocket();
  });

  onBeforeUnmount(() => {
    if (socket.value) {
      socket.value.close();
    }
  });

  return { orders, markPrice, buyOrders, sellOrders, groupSize };
};