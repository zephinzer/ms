import * as express from 'express';
import * as data from './data';
import * as security from './security';

export interface CreateServerConfigurations extends CreateServerEnablers {
  cookies?: data.cookies.DataCookiesOptions;
  cors?: security.cors.SecurityCorsOptions;
  csp?: security.csp.SecurityCspOptions;
  jsonBody?: data.json.DataJsonOptions;
  urlEncodedBody?: data.urlEncoded.DataUrlEncodedOptions;
}

export interface CreateServerEnablers {
  enableCors?: boolean;
  enableCsp?: boolean;
  enableCookies?: boolean;
  enableJsonBody?: boolean;
  enableUrlEncodedBody?: boolean;
}

export interface CreateServerHooks {
  after?: express.RequestHandler[];
  before?: express.RequestHandler[];
}

export interface CreateServerOptions extends CreateServerConfigurations {
  logger?: object;
  middlewares?: CreateServerHooks;
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
  middlewares = {},
  logger = console,
  urlEncodedBody,
}: CreateServerOptions = {}): express.Application {
  const app = express();

  // any pre-injection middlewares?
  if (middlewares.before && middlewares.before.length > 0) {
    middlewares.before.forEach((requestHandler) => app.use(requestHandler));
  }

  // standard http security - not an option
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

  // any post-injection middlewares?
  if (middlewares.after && middlewares.after.length > 0) {
    middlewares.after.forEach((requestHandler) => app.use(requestHandler));
  }

  return app;
}
