import config from './config';
import server from './server';

const serverInstance = server().listen(
  config.get('port'),
  config.get('bindAddress'),
  (err) => (err) && console.error(err));
  
serverInstance.on('listening', () => {
  console.info(`Listening at http://${serverInstance.address().address}:${serverInstance.address().port}`);
});

serverInstance.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

serverInstance.on('close', () => {
  console.info('Server gracefully shut down.');
});
  
const createExitSignalHandler = (signal, exitCode) => (
  () => {
    console.error(`\nUnexpected signal ${signal} received.`);
    serverInstance.close(() => {
      console.info(`Exiting with status code ${exitCode}.`);
      process.exit(exitCode);
    });
  }
)
process.on('SIGTERM', createExitSignalHandler('SIGTERM', 128));
process.on('SIGINT', createExitSignalHandler('SIGINT', 129));
