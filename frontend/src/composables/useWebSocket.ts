import { ref, onMounted, onBeforeUnmount } from "vue";
import { type Order } from "@/types";

export const useWebSocket = () => {
  const orders = ref<Order[]>([]);
  const markPrice = ref<number | null>(null);
  const socket = ref<WebSocket | null>(null);

  const insertOrder = (order: Order) => {
    const existingOrderIndex = orders.value.findIndex((o) => o.id === order.id);
    if (existingOrderIndex !== -1) {
      orders.value[existingOrderIndex] = order;
    } else {
      orders.value.push(order);
    }

    // Sort orders by price in decreasing order
    orders.value.sort((a, b) => b.price - a.price);

    // Update mark price based on the best buy and sell prices
    const bestBuy = orders.value.find((o) => o.side === "buy")?.price ?? 0;
    const bestSell = orders.value.find((o) => o.side === "sell")?.price ?? 0;
    markPrice.value = (bestBuy + bestSell) / 2;
  };

  const deleteOrder = (orderId: string) => {
    // Filter out the order with the given ID
    orders.value = orders.value.filter((order) => order.id !== orderId);

    // Recalculate mark price after deletion
    const bestBuy = orders.value.find((o) => o.side === "buy")?.price ?? 0;
    const bestSell = orders.value.find((o) => o.side === "sell")?.price ?? 0;
    markPrice.value = (bestBuy + bestSell) / 2;
  };

  const initializeWebSocket = () => {
    socket.value = new WebSocket("ws://localhost:8080");

    socket.value.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.value.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const data = JSON.parse(event.data);

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

  return { orders, markPrice };
};
