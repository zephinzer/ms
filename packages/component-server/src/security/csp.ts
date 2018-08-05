import * as express from 'express';
import * as helmet from 'helmet';
import {ServerMiddleware} from '../middlewares';

export function provisionCspReportingMiddleware({
  application,
  logger = console,
  logLevel = 'warn',
  reportUri = '/csp-report',
}: ProvisionCspReportingMiddleware = {}): void {
  if (!application) {
    // tslint:disable-next-line max-line-length
    throw new Error(':application needs to be defined to provision a CSP reporter endpoint.');
  }
  if (typeof logger[logLevel] !== 'function') {
    // tslint:disable-next-line max-line-length
    throw new Error(`:logLevel "${logLevel}" was not found in the provided :logger.`);
  }
  application.post(reportUri, (req, res) => {
    if (req.body) {
      logger[logLevel]({
        message: 'CSP violation reported',
        data: req.body,
      });
    } else {
      logger[logLevel]({
        message: 'CSP violation reported with no data',
        data: null,
      });
    }
    res.status(204).send();
  });
}

export function createMiddleware({
  childSrc = ['"self"'],
  connectSrc = ['"self"'],
  defaultSrc = ['"self"'],
  disableAndroid = false,
  fontSrc = ['"self"'],
  imgSrc = ['"self"'],
  objectSrc = ['"none"'],
  reportUri = '/csp-report',
  sandbox = ['allow-forms', 'allow-scripts'],
  scriptSrc = ['"self"'],
  styleSrc = ['"self"'],
}: SecurityCspOptions = {}): ServerMiddleware {
  return helmet.contentSecurityPolicy({
    directives: {
      childSrc,
      connectSrc,
      defaultSrc,
      fontSrc,
      imgSrc,
      objectSrc,
      reportUri,
      sandbox,
      scriptSrc,
      styleSrc,
    },
    disableAndroid,
    browserSniff: true,
  });
}

export interface SecurityCspOptions {
  childSrc?: string[];
  connectSrc?: string[];
  defaultSrc?: string[];
  disableAndroid?: boolean;
  fontSrc?: string[];
  imgSrc?: string[];
  logger?: object;
  logLevel?: string;
  objectSrc?: string[];
  reportUri?: string;
  sandbox?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
}

export interface ProvisionCspReportingMiddleware
  extends SecurityCspOptions {
  application?: express.Application;
}
