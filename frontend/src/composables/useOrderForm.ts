
import { ref } from "vue";
import { OrderResult, type OrderFormData } from "@/types";

export const useOrderForm = () => {

  const API_URL = import.meta.env.VITE_APP_API_URL;
  
  const orderStatus = ref<string | null>(null);

  const placeOrder = async (data: OrderFormData) => {

    try {
      const response = await fetch(`http://${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result === OrderResult.Inserted) {
          orderStatus.value = `Order has been inserted! id: ${data.order.id}`;
        } else if (data.result === OrderResult.Executed) {
          orderStatus.value = "Order has been executed!";
        }
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      orderStatus.value = error instanceof Error ? error.message : "Unknown error";
    }
  };

  return {
    orderStatus,
    placeOrder
  };
};
