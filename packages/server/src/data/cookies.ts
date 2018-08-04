import {Handler} from 'express';
import * as cookieParser from 'cookie-parser';

const cookieSession = require('cookie-session');

export function createMiddleware({
  keys = ['', ''],
  name = 'session',
  secret,
  domain = 'localhost',
  httpOnly = true,
  maxAge = 60e3 * 60,
  path = '/',
  sameSite = true,
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
      sameSite,
    }),
  ];
}

export interface CookieSessionOptions {
  domain?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean;
}

export interface DataCookiesOptions
  extends CookieSessionOptions {
  keys?: string[];
  name?: string;
  secret?: string;
}