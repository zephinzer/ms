const TABLE_NAME = 'roles';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.uuid('uuid');
    table.string('name', 64);
    table.text('description');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
