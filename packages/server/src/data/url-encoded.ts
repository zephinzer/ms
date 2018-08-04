import {Handler} from 'express';
import * as bodyParser from 'body-parser';

export function createMiddleware({
  type = '*/x-www-form-urlencoded',
  limit = '100kb',
}: DataUrlEncodedOptions = {}): Handler {
  return bodyParser.urlencoded({
    extended: true,
    limit,
    parameterLimit: 100,
    type,
  });
}

export interface DataUrlEncodedOptions {
  limit?: string;
  type?: string;
}
