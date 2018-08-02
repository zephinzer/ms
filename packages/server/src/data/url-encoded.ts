import {Handler} from 'express';
import * as bodyParser from 'body-parser';

export interface DataUrlEncodedCreateMiddlewareParameters {
  limit?: string;
  type?: string;
}

export function createMiddleware({
  type = '*/x-www-form-urlencoded',
  limit = '100kb',
}: DataUrlEncodedCreateMiddlewareParameters = {}): Handler {
  return bodyParser.urlencoded({
    extended: true,
    limit,
    parameterLimit: 100,
    type,
  });
}
