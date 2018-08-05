import {expect} from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import * as metrics from './metrics';

describe('@usvc/server/observability/metrics', () => {
  let metricsInstance: metrics.MetricsComponent;
  let server: express.Application;
  let observedMetrics: string;

  before(() => {
    metricsInstance = metrics.create();
    server = express();
    server.use(metricsInstance.getExpressMiddleware());
    server.get('/', (_req, res) => {
      res.json('ok');
    });
    metricsInstance.provisionMetrics(server);
    return supertest(server)
      .get('/')
      .then(() =>
        supertest(server)
          .get('/metrics'),
      )
      .then(({text}) => {
        observedMetrics = text;
      });
  });

  it('works well', () => {
    expect(observedMetrics).to.contain(
      'up 1',
    );
    expect(observedMetrics).to.contain(
      'status_code="200",method="GET",path="/"',
    );
    expect(observedMetrics).to.contain(
      // tslint:disable-next-line max-line-length
      'http_request_duration_seconds_sum{status_code="200",method="GET",path="/"}',
    );
    expect(observedMetrics).to.contain(
      // tslint:disable-next-line max-line-length
      'http_request_duration_seconds_count{status_code="200",method="GET",path="/"}',
    );
  });
});
