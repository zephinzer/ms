import {Handler} from 'express';
import * as bodyParser from 'body-parser';

export function createMiddleware({
  type = '*/json',
  limit = '100kb',
}: DataJsonOptions = {}): Handler {
  return bodyParser.json({limit, type});
}

export interface DataJsonOptions {
  limit?: string;
  type?: string;
}
