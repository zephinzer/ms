import express from 'express';
import knex from 'knex';
import getUserId from './get-user-id';
import getUsers from './get-users';
import common from '../../common';

const {
  todoHandler,
  getMultipleResultsHandler,
  getSingleResultHandler,
} = common;

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;

export default function() {
  const router = express.Router();

  router.get('/', (req, res) => {
    const offset = req.query.offset ? parseInt(req.query.offset) : DEFAULT_OFFSET;
    const limit = req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT;
    getUsers({offset, limit})
      .then(getMultipleResultsHandler(res, {offset, limit}));
  });

  router.get('/:userId', (req, res) => {
    const {userId} = req.params;
    getUserId(userId)
      .then(getSingleResultHandler(res));
  });

  router.post('/', todoHandler('create a new user'));
  router.put('/:userId', todoHandler('updates an existing user'));
  router.patch('/:userId/:fieldName', todoHandler('updates a field of an existing user'));
  router.delete('/:userId', todoHandler('deletes an existing user'));
  return router;
};
