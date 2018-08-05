const {createServer} = require('../../');

const server = createServer();
server.use((err, req, res, next) => {
  console.error(err.message);
});
const instance = server.listen();
instance.on('listening', () => {
  const {port} = instance.address();
  console.info(`[es5] Listening on http://localhost:${port}. All is well.`);
  // process.exit(0);
});
