export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  txnType: "credit" | "debit";
}
