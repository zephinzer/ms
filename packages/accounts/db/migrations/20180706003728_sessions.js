const TABLE_NAME = 'sessions';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.uuid('uuid');
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('id').inTable('users');
    table.string('ipv4_address', 16); // trailing null
    table.string('ipv6_address', 46); // what ^ said
    table.text('user_agent');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
