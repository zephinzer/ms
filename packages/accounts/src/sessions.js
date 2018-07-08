import express from 'express';
import common from './common';
import db from './db';

const {todoHandler} = common;

function sessions(version) {
  return sessions[version]();
}

sessions.versions = () => Object.keys(sessions).filter((v) => v.match(/^v[0-9\.]+$/));

sessions.v1 = () => {
  const router = express.Router();
  router.get('/', todoHandler('retrieve sessions from database'));
  router.get('/:sessionId', todoHandler('retrieve a session from database'));
  router.post('/', todoHandler('create a new session'));
  router.put('/:sessionId', todoHandler('updates an existing session'));
  router.patch('/:sessionId/:fieldName', todoHandler('updates a field of an existing session'));
  router.delete('/:sessionId', todoHandler('deletes an existing session'));
  return router;
};

export default sessions;
