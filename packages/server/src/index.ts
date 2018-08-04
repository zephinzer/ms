import * as express from 'express';
import * as data from './data';
import * as security from './security';

export interface CreateServer {
  enableCors?: boolean,
  enableCookies?: boolean;
  enableJsonBody?: boolean;
  enableUrlEncodedBody?: boolean;
  cors?: security.cors.DataCorsOptions;
  jsonBody?: data.json.DataJsonOptions;
  urlEncodedBody?: data.urlEncoded.DataUrlEncodedOptions;
  cookies?: data.cookies.DataCookiesOptions;
}
export function createServer({
  enableCors = true,
  enableCookies = true,
  enableJsonBody = true,
  enableUrlEncodedBody = true,
  cors,
  jsonBody,
  urlEncodedBody,
  cookies,
}: CreateServer = {}): express.Application {
  const app = express();
  app.use(security.http.createMiddleware());

  if (enableCors) {
    app.use(security.cors.createMiddleware(cors));
  }

  if (enableJsonBody) {
    app.use(data.json.createMiddleware(jsonBody));
  }

  if (enableUrlEncodedBody) {
    app.use(data.urlEncoded.createMiddleware(urlEncodedBody));
  }

  if (enableCookies) {
    app.use(data.cookies.createMiddleware(cookies));
  }

  return app;
}
