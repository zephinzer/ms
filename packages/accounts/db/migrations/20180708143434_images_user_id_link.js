exports.up = function(knex, Promise) {
  return knex.table('users', (table) => {
    table.foreign('image_id').references('id').inTable('images');
  });
};

exports.down = function(knex, Promise) {
  return knex.table('users', (table) => {
    table.dropForeign('image_id');
  });
};
