import * as express from 'express';
import * as expressPromBundle from 'express-prom-bundle';
import * as Prometheus from 'prom-client';
import {ServerMiddleware} from '../middlewares';

export interface ObservabilityMetricsOptions {
  uri?: string;
}

export interface MetricsComponent {
  getExpressMiddleware: () => ServerMiddleware;
  provisionMetrics: (application: express.Application) => void;
}

export function create({
  uri = '/metrics',
}: ObservabilityMetricsOptions = {}): MetricsComponent {
  expressPromBundle.promClient.register.clear();
  const middleware = expressPromBundle({
    autoregister: false,
    includeMethod: true,
    includeStatusCode: true,
    includePath: true,
    promClient: {
      collectDefaultMetrics: true,
    },
  });
  const routeHandler = middleware.metricsMiddleware;
  return {
    getExpressMiddleware: () => middleware,
    provisionMetrics: (
      application,
    ) => application.get(uri, routeHandler),
  };
}
