import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { type Order, OrderSide } from "@/types";

export const useWebSocket = () => {
  const orders = ref<Order[]>([]);
  // const markPrice = ref<number | null>(null);
  const socket = ref<WebSocket | null>(null);

  const buyOrders = computed(() => {
    const _buyOrders = orders.value.filter(
      (order) => order.side === OrderSide.Buy
    );

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
    const _sellOrders = orders.value.filter(
      (order) => order.side === OrderSide.Sell
    );

    let cumulativeAmount = 0;

    return _sellOrders.map((order) => {
      cumulativeAmount += order.amount;
      return {
        ...order,
        total: cumulativeAmount,
      };
    });
  });

  const markPrice = computed(() => {
    const bestSellPrice =
      sellOrders.value[sellOrders.value.length - 1]?.price || 0;
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

  const initializeWebSocket = () => {
    socket.value = new WebSocket("ws://localhost:8080");

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

  return { orders, markPrice, buyOrders, sellOrders };
};
