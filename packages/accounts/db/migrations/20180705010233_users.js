const TABLE_NAME = 'users';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary().notNull();
    table.uuid('uuid').notNullable();
    table.string('email');
    table.string('phone', 64);
    table.integer('image_id').unsigned();
    table.string('username', 64);
    table.string('password');
    table.string('name_full', 192);
    table.string('name_middle', 64);
    table.string('name_first', 64);
    table.string('name_last', 64);
    table.text('description');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
