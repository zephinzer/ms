const faker = require('faker');
const utils = require('../../src/utils');
const {N_USERS} = require('./0010_users');
const {N_ROLES} = require('./0030_roles');

const N_USER_ROLE_LINKS = 10;

module.exports = {
  N_USER_ROLE_LINKS,
  generateFakeUserRoleLink,
  seed,
};

function generateFakeUserRoleLink(id, maxUserId, maxRoleId) {
  return {
    id,
    user_id: Math.ceil(Math.random() * maxUserId), 
    role_id: Math.ceil(Math.random() * maxRoleId),
  };
}

function seed(knex, Promise) {
  return knex('user_role_links').del().then(() => {
    let seedUserRoleLinks = [];
    process.stdout.write(`Creating ${N_USER_ROLE_LINKS} seed user_role_links...`);
    for (let i = 1; i <= N_USER_ROLE_LINKS; ++ i) {
      process.stdout.write('.');
      seedUserRoleLinks.push(generateFakeUserRoleLink(i, N_USERS, N_ROLES));
    }
    return knex('user_role_links').insert(seedUserRoleLinks);
  });
};
