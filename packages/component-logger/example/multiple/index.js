const {logger} = require('../../');
const transports = [
  logger.createConsoleTransport(),
];
logger.init({
  id: 'logger_1',
  formats: [
    (info) => ({
      ...info,
      id: 'logger_1',
    }),
  ],
  transports,
});

logger.init({
  id: 'logger_2',
  formats: [
    (info) => ({
      ...info,
      id: 'logger_2',
    }),
  ],
  transports,
})

logger.use('logger_1').info('hi from logger 1');
logger.use('logger_2').info('hi from logger 2');