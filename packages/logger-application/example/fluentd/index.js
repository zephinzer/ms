const logger = require('../../');
const id = '_test_fluentd'
logger.init({
  id,
  transports: [logger.createFluentTransport({id})]
});

logger.info('hi');

// wait for the log to be sent
setTimeout(() => {
  process.exit(0);
}, 500);