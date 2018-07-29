import express from 'express';
import * as superagent from 'superagent';
import {createLogger} from '../../';

const app = express();
let server;
app.use(createLogger());
app.get('/', (_req, res) => {
  setTimeout(() => {
    server.close(() => {
      process.exit(0);
    });
  }, 100);
  res.json('[es6] it works, see log above');
});
server = app.listen();
server.on('listening', () => {
  superagent
    .get(`http://localhost:${server.address().port}`)
    .end((_err, response) => {
      console.info(response.body);
    });
});
