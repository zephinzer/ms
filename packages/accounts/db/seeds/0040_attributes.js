const faker = require('faker');
const utils = require('../../src/utils');

const N_ATTRIBUTES = 30;

module.exports = {
  N_ATTRIBUTES,
  generateFakeAttribute,
  seed,
};

function generateFakeAttribute(id) {
  return {
    id,
    name: faker.hacker.adjective(),
    description: faker.lorem.paragraphs(),
  };
}

function seed(knex, Promise) {
  return knex('attributes').del().then(() => {
    let seedAttributes = [];
    process.stdout.write(`Creating ${N_ATTRIBUTES} seed attributes...`);
    for (let i = 1; i <= N_ATTRIBUTES; ++ i) {
      process.stdout.write('.');
      seedAttributes.push(generateFakeAttribute(i));
    }
    return knex('attributes').insert(seedAttributes);
  });
};
