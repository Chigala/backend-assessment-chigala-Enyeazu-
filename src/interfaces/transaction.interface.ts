import { Purpose, TxnType } from "@/dtos/transactions.dto";

export interface Transaction {
  id: string;
  amount: number;
  txnType: TxnType;
  purpose: Purpose;
  accountId: string;
  balanceBefore: number;
  balanceAfter: number;
  to: string;
  from: string;
}
export interface sendMoneyReturnProps {
  creditTxn: Transaction;
  debitTxn: Transaction;
}
