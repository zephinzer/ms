import express from 'express';
import common from './common';
import db from './db';

const {todoHandler} = common;

function roles(version) {
  return roles[version]();
}

roles.versions = () => Object.keys(roles).filter((v) => v.match(/^v[0-9\.]+$/));

roles.v1 = () => {
  const router = express.Router();
  router.get('/', todoHandler('retrieve roles from database'));
  router.get('/:roleId', todoHandler('retrieve a role from database'));
  router.get('/:roleId/users', todoHandler('retrieve users in a role from database'));
  router.post('/', todoHandler('create a new role'));
  router.put('/:roleId', todoHandler('updates an existing role'));
  router.patch('/:roleId/:fieldName', todoHandler('updates a field of an existing role'));
  router.delete('/:roleId', todoHandler('deletes an existing role'));
  return router;
};

export default roles;
