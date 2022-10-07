import { Model, ModelObject } from "objection";
import { Transaction } from "@/interfaces/transaction.interface";
import { Accounts } from "./accounts.model";
import { Purpose, TxnType } from "@/dtos/transactions.dto";

export class Transactions extends Model implements Transaction {
  id!: string;
  amount!: number;
  txnType!: TxnType;
  purpose!: Purpose;
  accountId: string;
  balanceBefore!: number;
  balanceAfter!: number;
  to: string;
  from: string;

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
