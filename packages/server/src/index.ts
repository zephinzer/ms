import * as express from 'express';
import * as data from './data';
import * as security from './security';

export interface CreateServer {
  enableCors?: boolean;
  enableCsp?: boolean;
  enableCookies?: boolean;
  enableJsonBody?: boolean;
  enableUrlEncodedBody?: boolean;
  cookies?: data.cookies.DataCookiesOptions;
  cors?: security.cors.SecurityCorsOptions;
  csp?: security.csp.SecurityCspOptions;
  jsonBody?: data.json.DataJsonOptions;
  logger?: object;
  urlEncodedBody?: data.urlEncoded.DataUrlEncodedOptions;
}

export function createServer({
  enableCors = true,
  enableCsp = true,
  enableCookies = true,
  enableJsonBody = true,
  enableUrlEncodedBody = true,
  cookies,
  cors,
  csp,
  jsonBody,
  logger = console,
  urlEncodedBody,
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

  if (enableCsp) {
    app.use(security.csp.createMiddleware(csp));
    security.csp.provisionCspReportingMiddleware({
      application: app,
      logger,
      ...csp,
    });
  }

  return app;
}
