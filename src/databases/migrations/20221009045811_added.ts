import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", table => {
    table.uuid("to").nullable();
    table.uuid("from").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", table => {
    table.dropColumn("to");
    table.dropColumn("from");
  });
}
