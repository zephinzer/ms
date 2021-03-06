import * as Case from 'case';
import * as express from 'express';
import * as morgan from 'morgan';
import * as os from 'os';

const DEFAULT_HOSTNAME = os.hostname() || process.env.HOSTNAME || 'unknown';
const DEFAULT_LOGGER = global.console;
const DEFAULT_LEVEL = 'info';

/**
 * Boostraps an Express-compatible middleware using Morgan.
 * Logs will be routed through :logger via the specified :level.
 * Tokens can be added using :additionalTokens and the :hostname
 * will be as specified.
 *
 * @param {CreateLoggerParameters} params
 * @param {Tokenizer[]} params.additionalTokens
 * @param {String} params.hostname
 * @param {LoggerInterface} params.logger
 * @param {String} params.level
 *
 * @throws {Error} when the :level` cannot be found in the :logger
 *
 * @return {express.RequestHandler}
 */
export function createMiddleware({
  additionalTokens = [],
  hostname = DEFAULT_HOSTNAME,
  logger = DEFAULT_LOGGER,
  level = DEFAULT_LEVEL,
}: CreateLoggerParameters = {}): express.RequestHandler {
  if (typeof logger[level] !== 'function') {
    // tslint:disable-next-line max-line-length
    throw new Error(`The specified level, "${level}", could not be found in the provided :logger.`);
  }
  morgan.token('hostname', () => hostname);
  additionalTokens.forEach((token) => {
    morgan.token(token.id, token.fn);
  });
  return morgan((tokens, req, res) => {
    const message = {
      contentLength: tokens['res'](req, res, 'content-length'),
      httpVersion: tokens['http-version'](req, res),
      level: 'access',
      method: tokens['method'](req, res),
      referrer: tokens['referrer'](req, res),
      remoteAddress: tokens['remote-addr'](req, res),
      remoteHostname: req['hostname'],
      responseTimeMs: tokens['response-time'](req, res),
      serverHostname: tokens['hostname'](req, res),
      status: tokens['status'](req, res),
      time: tokens['date'](req, res, 'iso'),
      url: tokens['url'](req, res),
      userAgent: tokens['user-agent'](req, res),
    };
    additionalTokens.forEach((token) => {
      const messageKey = Case.camel(token.id);
      if (!message[messageKey]) {
        message[messageKey] = tokens[token.id](req, res);
      }
    });
    return JSON.stringify(message);
  }, {
    stream: {
      write: (_message) => {
        const message = JSON.parse(_message);
        logger[level](message);
      },
    },
  });
}

export function getZipkinTokenizers(): Tokenizer[] {
  return [
    {
      fn: (req) => req.context.traceId,
      id: 'trace-id',
    },
    {
      fn: (req) => req.context.spanId,
      id: 'span-id',
    },
    {
      fn: (req) => req.context.parentId,
      id: 'parent-span-id',
    },
    {
      fn: (req) => req.context.sampled,
      id: 'sampled',
    },
  ];
}

export interface LoggerInterface {
  // disabled so that loggers have the freedom to implement
  // any method using any level name
  //
  // tslint:disable-next-line no-any
  [key: string]: any;
}

export interface ExtendedRequest extends express.Request {
  // disabling this so that the request object can contain custom
  // passed-down paremters which is necessary for the zipkin
  // context to be made available to the logger
  //
  // tslint:disable-next-line no-any
  [key: string]: any;
}

export interface ExtendedTokenCallbackFn extends morgan.TokenCallbackFn {
  (req: ExtendedRequest, res: express.Response): boolean | number | string;
}

export interface Tokenizer {
  id: string;
  fn: ExtendedTokenCallbackFn;
}

export interface CreateLoggerParameters {
  additionalTokens?: Tokenizer[];
  hostname?: string;
  logger?: LoggerInterface;
  level?: string;
}
