import * as express from 'express';

export type ServerMiddleware = express.RequestHandler | express.RequestHandler[];
