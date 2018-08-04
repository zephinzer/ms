import * as bodyParser from 'body-parser';
import {ServerMiddleware} from '../middlewares';

export function createMiddleware({
  type = '*/x-www-form-urlencoded',
  limit = '100kb',
}: DataUrlEncodedOptions = {}): ServerMiddleware {
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
