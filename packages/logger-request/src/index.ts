import * as express from 'express';
import * as morgan from 'morgan';
import * as os from 'os';
import * as Case from 'case';

const DEFAULT_HOSTNAME = os.hostname() || process.env.HOSTNAME || 'unknown';
const DEFAULT_LOGGER = global.console;
const DEFAULT_LEVEL = 'info';

export interface LoggerInterface {
[key: string]: any;
}

export interface ExtendedRequest extends express.Request {
  [key: string]: any;
}

export interface ExtendedTokenCallbackFn {
  (req: ExtendedRequest, res: express.Response): any;
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

export function createLogger({
  additionalTokens = [],
  hostname = DEFAULT_HOSTNAME,
  logger = DEFAULT_LOGGER,
  level = DEFAULT_LEVEL,
}: CreateLoggerParameters = {}): express.RequestHandler {
  morgan.token('hostname', (req, res) => hostname);
  // morgan.token('trace-id', (req, res) => req.context.traceId);
  // morgan.token('span-id', (req, res) => req.context.spanId);
  // morgan.token('parent-span-id', (req, res) => req.context.parentId);
  // morgan.token('sampled', (req, res) => req.context.sampled);
  additionalTokens.forEach((token) => {
    morgan.token(token.id, token.fn);
  });
  return morgan((tokens, req, res) => {
    const message = {
      level: 'access',
      method: tokens['method'](req, res),
      url: tokens['url'](req, res),
      status: tokens['status'](req, res),
      contentLength: tokens['res'](req, res, 'content-length'),
      responseTimeMs: tokens['response-time'](req, res),
      // traceId: tokens['trace-id'](req, res),
      // spanId: tokens['span-id'](req, res),
      // parentSpanId: tokens['parent-span-id'](req, res),
      // sampled: tokens['sampled'](req, res),
      httpVersion: tokens['http-version'](req, res),
      referrer: tokens['referrer'](req, res),
      remoteHostname: req['hostname'],
      remoteAddress: tokens['remote-addr'](req, res),
      serverHostname: tokens['hostname'](req, res),
      time: tokens['date'](req, res, 'iso'),
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
      }
    }
  });
};
