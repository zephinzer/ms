import * as express from 'express';
import * as cors from 'cors';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface SecurityCorsCreateMiddlewareParameters {
  credentials?: boolean;
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  methods?: HttpMethods[];
  optionsSuccessStatus?: number;
  preflightContinue?: boolean;
  urls?: string[];
}

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
const DEFAULT_MAX_AGE = 1000 * 60 * 60 * 24; // one day cache

export function createMiddleware({
  allowedHeaders = undefined,
  credentials = true,
  exposedHeaders = undefined,
  maxAge = DEFAULT_MAX_AGE,
  methods = DEFAULT_METHODS,
  optionsSuccessStatus = 204,
  preflightContinue = true,
  urls = [],
}: SecurityCorsCreateMiddlewareParameters = {}): express.Handler {
  return cors({
    allowedHeaders,
    credentials,
    exposedHeaders,
    maxAge,
    methods,
    optionsSuccessStatus,
    origin: (o, cb) => {
      if (o === '' || urls.indexOf(o) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Invalid origin'));
      }
    },
    preflightContinue,
  });
}
