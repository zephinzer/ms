import {Handler} from 'express';
import * as bodyParser from 'body-parser';

export interface DataJsonCreateMiddlewareParameters {
  limit?: string;
  type?: string;
}

export function createMiddleware({
  type = '*/json',
  limit = '100kb',
}: DataJsonCreateMiddlewareParameters = {}): Handler {
  return bodyParser.json({limit, type});
}
