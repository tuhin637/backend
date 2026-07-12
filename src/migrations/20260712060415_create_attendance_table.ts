import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary();
    table
      .integer('employee_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE');
    table.date('date').notNullable();
    table.time('check_in_time').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['employee_id', 'date']); // একই employee এর একই date এ একটাই entry
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('attendance');
}