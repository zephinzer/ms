const convict = require('convict');

const schema = {
  bindAddress: {
    doc: 'The address to bind to',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'BIND_ADDRESS',
    arg: 'bindAddress'
  },
  databasePassword: {
    doc: 'Password of user in database',
    default: 'password',
    env: 'DATABASE_PASSWORD',
    arg: 'databasePassword',
  },
  databasePort: {
    doc: 'Port of database',
    default: 3307,
    env: 'DATABASE_PORT',
    arg: 'databasePort',
  },
  databaseSchema: {
    doc: 'Name of schema in database',
    default: 'accounts',
    env: 'DATABASE_SCHEMA',
    arg: 'databaseSchema',
  },
  databaseUser: {
    doc: 'Username of user in database',
    default: 'user',
    env: 'DATABASE_USER',
    arg: 'databaseUser',
  },
  nodeEnv: {
    doc: 'Application environment',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'nodeEnv',
  },
  port: {
    doc: 'Port to bind to',
    format: 'port',
    default: 4000,
    env: 'PORT',
    arg: 'port',
  },
};

const config = convict(schema);
config.validate({allowed: 'strict'});

module.exports = config;
