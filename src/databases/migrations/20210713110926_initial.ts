import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("users", table => {
      table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
      table.string("email", 45).notNullable();
      table.string("password", 255).notNullable();
      table.timestamps(true, true);
    })
    .createTable("accounts", table => {
      table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
      table.string("name", 45).notNullable();
      table.integer("balance").notNullable();
      table.uuid("user_id").notNullable();
      table.index(["user_id"], "fk_accounts_users_idx");
      table.string("txnPassword", 255).notNullable();
      table.timestamps(true, true);
    })
    .createTable("transactions", table => {
      table.uuid("id").primary().defaultTo(knex.raw("(uuid())"));
      table.integer("balanceBefore").notNullable();
      table.integer("balanceAfter").notNullable();
      table.enum("txnType", ["credit", "debit"]).notNullable();
      table.enum("purpose", ["deposit", "withdrawal", "transfer"]).notNullable();
      table.integer("amount").notNullable();
      table.uuid("account_id").notNullable();
      table.index(["account_id"], "fk_transactions_accounts_idx");
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("accounts").dropTable("users").dropTable("transactions");
}
