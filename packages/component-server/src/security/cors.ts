import * as cors from 'cors';
import {ServerMiddleware} from '../middlewares';

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const DEFAULT_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD',
];
const DEFAULT_MAX_AGE = ONE_DAY_IN_MILLISECONDS;

export function createMiddleware({
  allowedHeaders,
  credentials = true,
  exposedHeaders,
  maxAge = DEFAULT_MAX_AGE,
  methods = DEFAULT_METHODS,
  optionsSuccessStatus = 204,
  preflightContinue = true,
  urls = [],
}: SecurityCorsOptions = {}): ServerMiddleware {
  return cors({
    allowedHeaders,
    credentials,
    exposedHeaders,
    maxAge,
    methods,
    optionsSuccessStatus,
    origin: (origin, cb) => {
      if (!origin || urls.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        const error = new Error(`Invalid origin: "${origin}"`);
        error['status'] = 401;
        cb(error, false);
      }
    },
    preflightContinue,
  });
}

export type HttpMethods =
  'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';

export interface SecurityCorsOptions {
  allowedHeaders?: string[];
  credentials?: boolean;
  exposedHeaders?: string[];
  maxAge?: number;
  methods?: HttpMethods[];
  optionsSuccessStatus?: number;
  preflightContinue?: boolean;
  urls?: string[];
}
