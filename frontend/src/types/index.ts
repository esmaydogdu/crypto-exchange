export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export type Order = {
  id: string;
  side: OrderSide;
  price: number;
  amount: number;
};
