export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export type Order = {
  id: string;
  side: OrderSide;
  price: number;
  amount: number;
  total?: number;
};

export type GroupOrder = {
  [key: number]: Order
}