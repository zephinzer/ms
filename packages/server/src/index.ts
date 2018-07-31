import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

export interface CreateServer {
  enableCookieParsing?: boolean;
  enableJsonBody?: boolean;
  enableUrlEncodedBody?: boolean;
  jsonBodyLimit?: string;
  jsonBodyType?: string;
  urlEncodedLimit?: string;
  urlEncodedType?: string;
}
export function createServer({
  enableCookieParsing = true,
  enableJsonBody = true,
  enableUrlEncodedBody = true,
  jsonBodyLimit = '100kb',
  jsonBodyType = '*/json',
  urlEncodedLimit = '100kb',
  urlEncodedType = '*/x-www-form-urlencoded',
}: CreateServer = {}): express.Application {
  const app = express();
  app.use(helmet());
  if (enableJsonBody) {
    app.use(bodyParser.json({
      limit: jsonBodyLimit,
      type: jsonBodyType,
    }));
  }
  if (enableUrlEncodedBody) {
    app.use(bodyParser.urlencoded({
      extended: true,
      limit: urlEncodedLimit,
      parameterLimit: 100,
      type: urlEncodedType,
    }));
  }
  if (enableCookieParsing) {
    app.use(cookieParser());
  }

  return app;
}
