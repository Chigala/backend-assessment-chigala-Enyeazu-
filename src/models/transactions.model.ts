import { Model, ModelObject } from "objection";
import { Transaction } from "@/interfaces/transaction.interface";
import { Accounts } from "./accounts.model";

export class Transactions extends Model implements Transaction {
  id!: string;
  amount!: number;
  txnType!: "credit" | "debit";
  purpose!: "deposit" | "withdrawal" | "transfer";
  accountId: string;
  balanceBefore!: number;
  balanceAfter!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = "transactions"; // database table name
  static idColumn = "id"; // id column name
  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: Accounts,
      join: {
        from: "transactions.accountId",
        to: "users.id",
      },
    },
  };
}

export type TransactionShape = ModelObject<Transactions>;
