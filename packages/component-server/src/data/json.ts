import * as bodyParser from 'body-parser';
import {ServerMiddleware} from '../middlewares';

export function createMiddleware({
  type = '*/json',
  limit = '100kb',
}: DataJsonOptions = {}): ServerMiddleware {
  return bodyParser.json({limit, type});
}

export interface DataJsonOptions {
  limit?: string;
  type?: string;
}
