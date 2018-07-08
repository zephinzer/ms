const faker = require('faker');
const utils = require('../../src/utils');
const {N_USERS} = require('./0010_users');

const N_SESSIONS = 100;

module.exports = {
  N_SESSIONS,
  generateFakeSession,
  seed,
};

function generateFakeSession(maxId) {
  const userId = Math.ceil(Math.random() * maxId);
  return {
    user_id: userId,
    ipv4_address: faker.internet.ip(),
    ipv6_address: faker.internet.ipv6(),
    user_agent: faker.internet.userAgent(),
  };
}

function seed(knex, Promise) {
  return knex('sessions').del().then(() => {
    let seedSessions = [];
    process.stdout.write(`Creating ${N_SESSIONS} seed sessions...`);
    for (let i = 1; i <= N_SESSIONS; ++ i) {
      process.stdout.write('.');
      seedSessions.push(generateFakeSession(N_USERS));
    }
    return knex('sessions').insert(seedSessions);
  });
};
