export interface Transaction {
  id: string;
  amount: number;
  txnType: "credit" | "debit";
  purpose: "deposit" | "withdrawal" | "transfer";
  accountId: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
  updatedAt: Date;
}
