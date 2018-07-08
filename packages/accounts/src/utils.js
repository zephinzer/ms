const cryptoJs = require('crypto-js');
const config = require('./config');

const isDevelopment = (config.get('nodeEnv') !== 'production');

const PASSWORD_SALT_LENGTH = 64;
const PASSWORD_KEY_SIZE = 6;
const PASSWORD_ITERATIONS = isDevelopment ? 100 : 10000;
const PASSWORD_STORED_ENCODING = 'base64';
const PASSWORD_USAGE_ENCODING = 'ascii';

module.exports = {
  generateHash,
  validatePassword,
};

function generateHash(password) {
  const salt = cryptoJs.lib.WordArray.random(PASSWORD_SALT_LENGTH);
  const key = cryptoJs.PBKDF2(
    password, salt.toString(),
    {
      keySize: PASSWORD_KEY_SIZE,
      iterations: PASSWORD_ITERATIONS,
    }
  );
  const saltString =
    Buffer.from(salt.toString())
      .toString(PASSWORD_STORED_ENCODING);
  const keyString =
    Buffer.from(key.toString())
      .toString(PASSWORD_STORED_ENCODING);
  return `${keyString}.${saltString}`;
};

function validatePassword(password, storedHash) {
  const config = storedHash.split('.');
  const keyString =
    Buffer.from(config[0], PASSWORD_STORED_ENCODING)
      .toString(PASSWORD_USAGE_ENCODING);
  const saltString =
    Buffer.from(config[1], PASSWORD_STORED_ENCODING)
      .toString(PASSWORD_USAGE_ENCODING);
  const key = cryptoJs.PBKDF2(
    password, saltString,
    {
      keySize: PASSWORD_KEY_SIZE,
      iterations: PASSWORD_ITERATIONS,
    }
  );
  return (keyString === key.toString());
};
