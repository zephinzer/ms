import {Handler} from 'express';
import * as cookieParser from 'cookie-parser';
import cookieSession = require('cookie-session');

export function createMiddleware({
  keys = ['', ''],
  name = 'session',
  secret,
  domain = 'localhost',
  httpOnly = true,
  maxAge = 60e3 * 60,
  path = '/',
}: DataCookiesOptions = {}): Handler[] {
  return [
    cookieParser(),
    cookieSession({
      keys,
      name,
      secret,
      domain,
      httpOnly,
      maxAge,
      path,
    }),
  ];
}

export interface CookieSessionOptions {
  path?: string;
  sameSite?: boolean;
  keys?: string[];
  name?: string;
  secret?: string;

}

export interface DataCookiesOptions extends CookieSessionOptions {
  domain?: string;
  httpOnly?: boolean;
  maxAge?: number;
}
