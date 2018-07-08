const faker = require('faker');
const utils = require('../../src/utils');
const {N_USERS} = require('./0010_users');
const {N_ATTRIBUTES} = require('./0040_attributes');

const N_USER_ATTRIBUTE_LINKS = 10;

module.exports = {
  N_USER_ATTRIBUTE_LINKS,
  generateFakeUserAttributeLink,
  seed,
};

function generateFakeUserAttributeLink(id, maxUserId, maxAttributeId) {
  return {
    id,
    user_id: Math.ceil(Math.random() * maxUserId), 
    attribute_id: Math.ceil(Math.random() * maxAttributeId),
  };
}

function seed(knex, Promise) {
  return knex('user_attribute_links').del().then(() => {
    let seedUserAttributeLinks = [];
    process.stdout.write(`Creating ${N_USER_ATTRIBUTE_LINKS} seed user_attribute_links...`);
    for (let i = 1; i <= N_USER_ATTRIBUTE_LINKS; ++ i) {
      process.stdout.write('.');
      seedUserAttributeLinks.push(generateFakeUserAttributeLink(i, N_USERS, N_ATTRIBUTES));
    }
    return knex('user_attribute_links').insert(seedUserAttributeLinks);
  });
};
