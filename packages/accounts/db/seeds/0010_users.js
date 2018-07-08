const faker = require('faker');
const utils = require('../../src/utils');

const N_USERS = 100;

module.exports = {
  N_USERS,
  generateFakeUser,
  seed,
};

function generateFakeUser(id) {
  const firstName = faker.name.firstName();
  const middleName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  return {
    id,
    email,
    phone: faker.phone.phoneNumber('(###)###-####'),
    username: faker.internet.userName(firstName, lastName),
    // the password is the email
    password: utils.generateHash(email),
    name_full: `${firstName} ${middleName} ${lastName}`,
    name_first: firstName,
    name_middle: middleName,
    name_last: lastName,
    description: faker.lorem.paragraphs(),
  };
}

function seed(knex, Promise) {
  return knex('user_role_links').del().then(() => {
    return knex('user_attribute_links').del().then(() => {
      return knex('images').del().then(() => {
        return knex('sessions').del().then(() => {
          return knex('users').del().then(() => {
            let seedUsers = [];
            process.stdout.write(`Creating ${N_USERS} seed users...`);
            for (let i = 1; i <= N_USERS; ++ i) {
              process.stdout.write('.');
              seedUsers.push(generateFakeUser(i));
            }
            return knex('users').insert(seedUsers);
          });
        });
      });
    });
  });
};
