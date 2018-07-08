const TABLE_NAME = 'user_role_links';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('role_id').unsigned().notNull();
    table.foreign('role_id').references('id').inTable('roles');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
