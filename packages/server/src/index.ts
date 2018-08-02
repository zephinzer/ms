import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as data from './data';
import * as security from './security';

export interface CreateServer {
  enableCors?: boolean,
  enableCookieParsing?: boolean;
  enableJsonBody?: boolean;
  enableUrlEncodedBody?: boolean;
  corsAllowedHeaders?: string[];
  corsCredentials?: boolean;
  corsExposedHeaders?: string[];
  corsMaxAge?: number;
  corsMethods?: security.cors.HttpMethods[];
  corsOptionsSuccessStatus?: number;
  corsPreflightContinue?: boolean;
  corsUrls?: string[];
  jsonBodyLimit?: string;
  jsonBodyType?: string;
  urlEncodedLimit?: string;
  urlEncodedType?: string;
}
export function createServer({
  enableCors = true,
  enableCookieParsing = true,
  enableJsonBody = true,
  enableUrlEncodedBody = true,
  corsAllowedHeaders,
  corsCredentials,
  corsExposedHeaders,
  corsMaxAge,
  corsMethods,
  corsOptionsSuccessStatus,
  corsPreflightContinue,
  corsUrls,
  jsonBodyLimit,
  jsonBodyType,
  urlEncodedLimit,
  urlEncodedType,
}: CreateServer = {}): express.Application {
  const app = express();
  app.use(security.http.createMiddleware());

  if (enableCors) {
    app.use(security.cors.createMiddleware({
      allowedHeaders: corsAllowedHeaders,
      credentials: corsCredentials,
      exposedHeaders: corsExposedHeaders,
      maxAge: corsMaxAge,
      methods: corsMethods,
      optionsSuccessStatus: corsOptionsSuccessStatus,
      preflightContinue: corsPreflightContinue,
      urls: corsUrls,
    }));
  }

  if (enableJsonBody) {
    app.use(data.json.createMiddleware({
      limit: jsonBodyLimit,
      type: jsonBodyType,
    }));
  }

  if (enableUrlEncodedBody) {
    app.use(data.urlEncoded.createMiddleware({
      limit: urlEncodedLimit,
      type: urlEncodedType,
    }));
  }

  if (enableCookieParsing) {
    app.use(data.cookies.createMiddleware());
  }

  return app;
}
