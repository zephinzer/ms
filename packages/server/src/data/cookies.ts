import {Handler} from 'express';
import * as cookieParser from 'cookie-parser';

export function createMiddleware(): Handler {
  return cookieParser();
}
