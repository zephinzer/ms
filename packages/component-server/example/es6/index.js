import {createServer} from '../../';

const server = createServer();
const instance = server.listen();
instance.on('listening', () => {
  const {port} = instance.address();
  console.info(`[es6] Listening on http://localhost:${port}. All is well.`);
  // process.exit(0);
});
