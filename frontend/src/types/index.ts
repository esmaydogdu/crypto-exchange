export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export enum OrderResult {
  Inserted = "inserted",
  Executed = "executed",
}

export type Order = {
  id: string;
  side: OrderSide;
  price: number;
  amount: number;
  total?: number;
};

export type OrderFormData = {
  side: OrderSide | null;
  price: number | null;
  amount: number | null;
}

export type GroupOrder = {
  [key: number]: Order
}