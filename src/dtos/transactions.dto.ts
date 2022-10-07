import { IsString, IsNumber } from "class-validator";
export enum TxnType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}
export enum Purpose {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}

export class UserTransactionsDto {
  @IsNumber()
  public amount: number;

  @IsString()
  public txnPassword: string;
}
