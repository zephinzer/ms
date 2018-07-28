import * as winston from 'winston';
import * as Transport from 'winston-transport';
import {TransformFunction} from 'logform';
import {Transports} from 'winston/lib/winston/transports';

export interface Levels {
  [key: string]: number;
}

export const DEFAULT_LEVELS: Levels = {
  silly: 5000,
  debug: 4000,
  info: 3000,
  http: 2000,
  warn: 1000,
  error: 0,
};

export const DEFAULT_LEVEL: string = 'info';

export type Initialize = (params?: InitializeParameters) => void;

export interface Logger {
  count: number;
  init: Initialize;
  [key: string]: any;
}

const logger: Logger = {
  count: 0,
  init: initialize,
};

export default logger;

export interface InitializeParameters {
  id?: string;
  formats?: TransformFunction[];
  setPrimary?: boolean;
  levels?: Levels;
  level?: string;
  transports?: Transport[];
}

function initialize({
  id = 'instance',
  formats = [],
  levels = DEFAULT_LEVELS,
  level = DEFAULT_LEVEL,
  setPrimary = false,
  transports: [],
}: InitializeParameters = {}): void {
  if (logger[id]) {
    throw new Error(
      `The logger\'s id, "${id}", clashes with an existing property.`
    );
  } else {
    const formatters = formats.map((formatter) => winston.format(formatter)());
    logger[id] = winston.createLogger({
      exitOnError: false,
      format: winston.format.combine(
        ...formatters,
        winston.format.timestamp(),
        winston.format.json(),
      ),
      levels,
      level,
      transports: [new winston.transports.Console()],
    });
  }
  if (logger.count++ === 0 || setPrimary === true) {
    Object.keys(levels)
      .forEach((levelKey) => logger[levelKey] = logger[id][levelKey]);
  }
}
