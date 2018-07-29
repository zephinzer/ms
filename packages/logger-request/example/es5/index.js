const express = require('express');
const superagent = require('superagent');
const {createLogger} = require('../../');
const app = express();
let server;
app.use(createLogger());
app.get('/', (_req, res) => {
  setTimeout(() => {
    server.close(() => {
      process.exit(0);
    });
  }, 100);
  res.json('[es5] it works, see log above');
});
server = app.listen();
server.on('listening', () => {
  superagent
    .get(`http://localhost:${server.address().port}`)
    .end((_err, response) => {
      console.info(response.body);
    });
});
