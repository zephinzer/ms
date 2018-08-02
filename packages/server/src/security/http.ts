import * as express from 'express';
import * as helmet from 'helmet';

export function createMiddleware(): express.Handler {
  return helmet();
}
