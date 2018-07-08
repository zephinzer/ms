import express from 'express';
import common from './common';
import db from './db';

const {todoHandler} = common;

function users(version) {
  return users[version]();
}

users.versions = () => Object.keys(users).filter((v) => v.match(/^v[0-9\.]+$/));

users.v1 = () => {
  const router = express.Router();
  router.get('/', todoHandler('retrieve users from database'));
  router.get('/:userId', todoHandler('retrieve a user from database'));
  router.post('/', todoHandler('create a new user'));
  router.put('/:userId', todoHandler('updates an existing user'));
  router.patch('/:userId/:fieldName', todoHandler('updates a field of an existing user'));
  router.delete('/:userId', todoHandler('deletes an existing user'));
  return router;
};

export default users;
