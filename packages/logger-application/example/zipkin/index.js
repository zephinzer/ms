const express = require('express');
const superagent = require('superagent');
const tracer = require('../../../tracer');
const logger = require('../../');

const tracerInstance = tracer.createTracer({
  url: 'http://localhost:9411',
});
const id = '_test_zipkin';
logger.init({
  id,
  formats: [logger.createZipkinContextFormatter({
    loggerId: 'zipkin',
    context: tracerInstance.getContext(),
  })],
  level: 0,
  transports: [logger.createConsoleTransport()],
});

const server = express();

server.use(tracerInstance.getExpressMiddleware());
server.use((_req, res) => {
  logger.info('this string comes from an express middleware, check out the traceId of this object');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
  res.json('ok');
});

const serverInstance = server.listen(11111);
serverInstance.on('listening', () => {
  superagent
    .get('http://localhost:11111')
    .then((response) => {
      logger.info(`server responded with: ${response.body.toString()}`);
    });
});
