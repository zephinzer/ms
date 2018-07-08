const TABLE_NAME = 'images';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.uuid('uuid').notNullable();
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('id').inTable('users');
    table.text('uri').notNull();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
