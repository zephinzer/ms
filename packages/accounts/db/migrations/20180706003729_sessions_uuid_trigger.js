const TABLE_NAME = 'sessions';

exports.up = function(knex, Promise) {
  return knex.schema.raw(`\
    CREATE TRIGGER before_insert_${TABLE_NAME}_set_uuid
    BEFORE INSERT ON ${TABLE_NAME}
    FOR EACH ROW BEGIN
      IF new.uuid IS NULL THEN SET new.uuid = uuid(); END IF;
    END`
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP TRIGGER before_insert_${TABLE_NAME}_set_uuid`);
};
