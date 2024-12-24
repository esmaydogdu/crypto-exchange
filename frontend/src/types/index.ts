export type Order = {
  id: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
};
