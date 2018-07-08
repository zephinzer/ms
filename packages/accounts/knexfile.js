// const config = require('./src/config');

module.exports = {
  client: 'mysql',
  version: '5.7',
  connection: {
    database: 'accounts', //config.get('databaseSchema'),
    port:     3307, //config.get('databasePort'),
    user:     'user', //config.get('databaseUser'),
    password: 'password', //config.get('databasePassword'),
  },
  pool: {
    min: 2,
    max: 10
  },
  seeds: {
    directory: './db/seeds',
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations'
  }
};
