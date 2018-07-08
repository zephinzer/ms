import express from 'express';
import users from './users';
import roles from './roles';
import attributes from './attributes';
import sessions from './sessions';
import db from './db';

const _server = () => {
  const server = express();
  server.use('/readyz', async (req, res) => {
    let readiness = {
      databaseMigrationsValid: (await db.isAtLatest()),
    };
    const overallReadiness =
      Object.keys(readiness).reduce((ready, readinessCheck) => {
        ready && readiness[readinessCheck];
      }, true);
    res.status(overallReadiness ? 200 : 500)
      .json(readiness);
  });
  users.versions().map((version) => server.use(`/api/${version}/users`, users(version)));
  sessions.versions().map((version) => server.use(`/api/${version}/sessions`, sessions(version)));
  roles.versions().map((version) => server.use(`/api/${version}/roles`, roles(version)));
  attributes.versions().map((version) => server.use(`/api/${version}/attributes`, attributes(version)));
  return server;
};

export default _server;
