const faker = require('faker');
const utils = require('../../src/utils');
const {N_IMAGES} = require('./0050_images');
const {N_USERS} = require('./0010_users');

module.exports = {
  generateFakeImage,
  seed,
};

function generateFakeImage(id, userId) {
  const imageId = Math.ceil(Math.random() * 1050);
  return {
    id,
    user_id: userId,
    uri: `https://picsum.photos/128/128?image=${imageId}`
  };
}

function seed(knex, Promise) {
  let seedPrimaryImages = [];
  process.stdout.write(`Creating ${N_USERS} seed primary user images...`);
  for (let i = 1; i <= N_USERS; ++ i) {
    process.stdout.write('.');
    seedPrimaryImages.push(generateFakeImage(N_IMAGES + i, i));
  }
  return knex('images').insert(seedPrimaryImages).then(() => {
    return Promise.all(seedPrimaryImages.map((seedImage) => {
      return knex('users')
        .update({
          image_id: seedImage.id,
        })
        .where({
          id: seedImage.user_id,
        });
    }));
  });
};
