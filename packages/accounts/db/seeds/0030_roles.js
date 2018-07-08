const faker = require('faker');
const utils = require('../../src/utils');

const N_ROLES = 10;

module.exports = {
  N_ROLES,
  generateFakeRole,
  seed,
};

function generateFakeRole(id) {
  return {
    id,
    name: faker.name.jobTitle(),
    description: faker.lorem.paragraphs(),
  };
}

function seed(knex, Promise) {
  return knex('roles').del().then(() => {
    let seedRoles = [];
    process.stdout.write(`Creating ${N_ROLES} seed roles...`);
    for (let i = 1; i <= N_ROLES; ++ i) {
      process.stdout.write('.');
      seedRoles.push(generateFakeRole(i));
    }
    return knex('roles').insert(seedRoles);
  });
};
