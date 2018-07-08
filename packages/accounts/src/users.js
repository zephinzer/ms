import express from 'express';
import knex from 'knex';
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
  router.get('/:userId', (req, res) => {
    const {userId} = req.params;
    console.info(userId);
    db()
      .select([
        'u.uuid',
        'u.email',
        'u.username',
        'u.name_full',
        'u.name_first',
        'u.name_last',
        'u.name_middle',
        'u.description',
        'i.uri as image_uri',
        'u.created_at',
        'u.updated_at',
      ])
      .from('users as u')
      .where({'u.id': userId})
      .leftOuterJoin('images as i', 'u.image_id', 'i.id')
      .then((user) => {
        if (user.length === 0) {
          res.status(404).json({});
        } else if (user.length === 1) {
          res.status(200).json(user[0]);
        } else {
          res.status(500).json({
            error: 'multiple users found',
          });
        }
      });
  });
  router.post('/', todoHandler('create a new user'));
  router.put('/:userId', todoHandler('updates an existing user'));
  router.patch('/:userId/:fieldName', todoHandler('updates a field of an existing user'));
  router.delete('/:userId', todoHandler('deletes an existing user'));
  return router;
};

export default users;
