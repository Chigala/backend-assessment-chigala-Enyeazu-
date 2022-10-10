import { Model, ModelObject } from "objection";
import { Account } from "@/interfaces/account.interface";
import { Users } from "./users.model";

export class Accounts extends Model implements Account {
  id!: string;
  name!: string;
  balance!: number;
  txnPassword: string;
  user_id!: string;

  static tableName = "accounts"; // database table name
  static idColumn = "id"; // id column name
}

export type AccountsShape = ModelObject<Accounts>;
