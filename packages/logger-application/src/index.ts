import * as winston from 'winston';
import * as Transport from 'winston-transport';
import {ExplicitContext} from 'zipkin';
import * as fluentLogger from 'fluent-logger';
import {TransformFunction} from 'logform';

const FluentTransport = fluentLogger.support.winstonTransport();

export interface Levels {
  [key: string]: number;
}

export const DEFAULT_ID: string = 'instance';

export const DEFAULT_LEVELS: Levels = {
  silly: 5000,
  debug: 4000,
  info: 3000,
  http: 2000,
  warn: 1000,
  error: 0,
};

export const DEFAULT_LEVEL: string = 'info';

const logger: Logger = {
  count: 0,
  createZipkinContextFormatter,
  createConsoleTransport,
  createFluentTransport,
  init: initialize,
  use: use,
  _instances: {},
};

export default logger;
// for es5 support
module.exports = logger;

export function use(id) {
  if (!logger._instances[id]) {
    // tslint:disable-next-line max-line-length
    throw new Error(`No logger with ID "${id}" could be found. Have you initialised it?`);
  }
  return logger._instances[id];
}

export function createConsoleTransport(): Transport {
  return new winston.transports.Console();
}

const DEFAULT_FLUENT_ID = 'fluent';
const DEFAULT_FLUENT_HOST = 'localhost';
const DEFAULT_FLUENT_PORT = 24224;
const DEFAULT_FLUENT_REQUIRE_ACK_RESPONSE = false;
const DEFAULT_FLUENT_SECURITY = {};
const DEFAULT_FLUENT_TIMEOUT = 3.0;
const DEFAULT_FLUENT_TLS = false;
const DEFAULT_FLUENT_TLS_OPTIONS = {};

export function createFluentTransport({
  id = DEFAULT_FLUENT_ID,
  host = DEFAULT_FLUENT_HOST,
  port = DEFAULT_FLUENT_PORT,
  requireAckResponse = DEFAULT_FLUENT_REQUIRE_ACK_RESPONSE,
  security = DEFAULT_FLUENT_SECURITY,
  timeout = DEFAULT_FLUENT_TIMEOUT,
  tls = DEFAULT_FLUENT_TLS,
  tlsOptions = DEFAULT_FLUENT_TLS_OPTIONS,
}: CreateFluentTransportParameters = {}): Transport {
  return new FluentTransport({
    tag: id,
    host,
    port,
    requireAckResponse,
    security,
    timeout,
    tls,
    tlsOptions,
  });
}

export function createZipkinContextFormatter({
  loggerId,
  context,
}: CreateZipkinContextFormatter): TransformFunction {
  return (info) => {
    info.loggerId = loggerId;
    if (context.currentCtx !== null) {
      info.spanId = context.currentCtx.spanId;
      info.traceId = context.currentCtx.traceId;
      info.parentId = context.currentCtx.parentId;
      info.sampled = context.currentCtx.sampled;
    }
    return info;
  };
}

function initialize({
  id = DEFAULT_ID,
  formats = [],
  levels = DEFAULT_LEVELS,
  level = DEFAULT_LEVEL,
  plugins = [],
  setPrimary = false,
  transports = [],
}: InitializeParameters = {}): void {
  if (logger._instances[id]) {
    // tslint:disable-next-line max-line-length
    throw new Error(`The logger\'s id, "${id}", clashes with an existing logger.`);
  } else {
    const pluginFormatters =
      plugins.map((plugin) => winston.format(plugin.format));
    const additionalFormatters =
      formats.map((format) => winston.format(format));
    const baseFormatters = [winston.format.timestamp, winston.format.json];
    const format = winston.format.combine(
      ...additionalFormatters.map((v) => v()),
      ...pluginFormatters.map((v) => v()),
      ...baseFormatters.map((v) => v()),
    );

    const pluginTransporters = plugins.map((plugin) => plugin.transport);
    const baseTransporters = transports;
    const transporters = pluginTransporters.concat(baseTransporters);

    logger._instances[id] = winston.createLogger({
      exitOnError: false,
      format,
      levels,
      level,
      transports: transporters,
    });
  }
  if (logger.count++ === 0 || setPrimary === true) {
    Object.keys(levels)
      .forEach((levelKey) => logger[levelKey] = logger._instances[id][levelKey]);
  }
}

export type Initialize = (params?: InitializeParameters) => void;
export interface InitializeParameters {
  id?: string;
  formats?: TransformFunction[];
  setPrimary?: boolean;
  levels?: Levels;
  level?: string;
  transports?: Transport[];
  plugins?: Plugins[];
}

export interface Logger {
  count: number;
  init: Initialize;
  _instances: LoggerInstance;
  [key: string]: any;
}

export interface LoggerInstance {
  [key: string]: winston.Logger;
}

export interface Plugins {
  format?: TransformFunction;
  transport?: Transport;
}

export interface FluentLoggerTlsOptions {
  [key: string]: any;
}

export interface FluentLoggerSecurity {
  clientHostname?: string;
  sharedKey?: string;
  username?: string;
  password?: string;
}

export interface CreateFluentTransportParameters {
  id?: string;
  host?: string;
  port?: number;
  timeout?: number;
  requireAckResponse?: boolean;
  security?: FluentLoggerSecurity;
  tls?: boolean;
  tlsOptions?: FluentLoggerTlsOptions;
}

export interface CreateZipkinContextFormatter {
  loggerId: string;
  context: ExtendedExplicitContext;
}

export interface RawExplicitContext {
  spanId: string,
  parentId: string;
  traceId: string;
  sampled: Symbol | boolean;
}

export interface ExtendedExplicitContext extends ExplicitContext {
  currentCtx: RawExplicitContext;
}

export interface CreateZipkinContextLoggerParameters
  extends InitializeParameters {
  context?: ExtendedExplicitContext | null;
}
