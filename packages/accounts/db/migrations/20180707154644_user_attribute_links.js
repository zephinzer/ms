const TABLE_NAME = 'user_attribute_links';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('attribute_id').unsigned().notNull();
    table.foreign('attribute_id').references('id').inTable('attributes');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
