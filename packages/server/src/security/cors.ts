import * as express from 'express';
import * as cors from 'cors';

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const DEFAULT_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD'
];
const DEFAULT_MAX_AGE = ONE_DAY_IN_MILLISECONDS;

export function createMiddleware({
  allowedHeaders = undefined,
  credentials = true,
  exposedHeaders = undefined,
  maxAge = DEFAULT_MAX_AGE,
  methods = DEFAULT_METHODS,
  optionsSuccessStatus = 204,
  preflightContinue = true,
  urls = [],
}: DataCorsOptions = {}): express.Handler {
  return cors({
    allowedHeaders,
    credentials,
    exposedHeaders,
    maxAge,
    methods,
    optionsSuccessStatus,
    origin: (o, cb) => {
      if (!o || urls.indexOf(o) !== -1) {
        cb(null, true);
      } else {
        const error = new Error('Invalid origin');
        error['status'] = 401;
        cb(error, false);
      }
    },
    preflightContinue,
  });
}

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface DataCorsOptions {
  allowedHeaders?: string[];
  credentials?: boolean;
  exposedHeaders?: string[];
  maxAge?: number;
  methods?: HttpMethods[];
  optionsSuccessStatus?: number;
  preflightContinue?: boolean;
  urls?: string[];
}
