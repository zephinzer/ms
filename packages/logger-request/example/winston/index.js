import express from 'express';
import * as winston from 'winston';
import * as superagent from 'superagent';
import {createLogger} from '../../';

const app = express();
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format((info) => {
      info.from = 'winston';
      return info;
    })(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
})
let server;
app.use(createLogger({
  logger,
  level: 'info',
}));
app.get('/', (_req, res) => {
  setTimeout(() => {
    server.close(() => {
      process.exit(0);
    });
  }, 100);
  res.json('[winston] it works, see log above');
});
server = app.listen();
server.on('listening', () => {
  superagent
    .get(`http://localhost:${server.address().port}`)
    .end((_err, response) => {
      console.info(response.body);
    });
});
