const faker = require('faker');
const utils = require('../../src/utils');
const {N_USERS} = require('./0010_users');

const N_IMAGES = 30;

module.exports = {
  N_IMAGES,
  generateFakeImage,
  seed,
};

function generateFakeImage(id, maxUserId) {
  const imageId = Math.ceil(Math.random() * 1050);
  return {
    id,
    user_id: Math.ceil(Math.random() * maxUserId),
    uri: `https://picsum.photos/128/128?image=${imageId}`
  };
}

function seed(knex, Promise) {
  return knex('images').del().then(() => {
    let seedImages = [];
    process.stdout.write(`Creating ${N_IMAGES} seed images...`);
    for (let i = 1; i <= N_IMAGES; ++ i) {
      process.stdout.write('.');
      seedImages.push(generateFakeImage(i, N_USERS));
    }
    return knex('images').insert(seedImages);
  });
};
