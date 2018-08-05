import * as express from 'express';
import * as helmet from 'helmet';
import {ServerMiddleware} from '../middlewares';

export function createMiddleware(): ServerMiddleware {
  return [
    helmet.dnsPrefetchControl(),
    helmet.frameguard(),
    helmet.hidePoweredBy(),
    helmet.hsts(),
    helmet.ieNoOpen(),
    helmet.noCache(),
    helmet.noSniff(),
    helmet.xssFilter(),
  ];
}
