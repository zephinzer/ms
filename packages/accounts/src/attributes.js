import express from 'express';
import common from './common';
import db from './db';

const {todoHandler} = common;

function attributes(version) {
  return attributes[version]();
}

attributes.versions = () => Object.keys(attributes).filter((v) => v.match(/^v[0-9\.]+$/));

attributes.v1 = () => {
  const router = express.Router();
  router.get('/', todoHandler('retrieve attributes from database'));
  router.get('/:attributeId', todoHandler('retrieve an attribute from database'));
  router.get('/:attributeId/users', todoHandler('retrieve users with the attribute from database'));
  router.post('/', todoHandler('create a new attribute'));
  router.put('/:attributeId', todoHandler('updates an existing attribute'));
  router.patch('/:attributeId/:fieldName', todoHandler('updates a field of an existing attribute'));
  router.delete('/:attributeId', todoHandler('deletes an existing attribute'));
  return router;
};

export default attributes;
