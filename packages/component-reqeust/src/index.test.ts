import * as chai from 'chai';
import * as express from 'express';
import * as superagent from 'superagent';
import {createRequest} from './';
import {createTracer} from '@usvc/tracer';

const {expect} = chai;

describe('@usvc/request', () => {
  let mockZipkin;
  let tracer;

  before((done) => {
    const mockService = express();
    mockService.post('/api/v2/spans', (req, res) => {
      res.status(202).end();
    });
    mockZipkin = mockService.listen(() => {
      tracer = createTracer({
        url: `http://localhost:${mockZipkin.address().port}`,
      });
      done();
    });
  });

  after((done) => {
    setTimeout(() => {
      mockZipkin.close();
      done();
    }, 1000);
  });

  context('integration', () => {
    context('with tracer', () => {
      let tracerA;
      let tracerB;
      let request;
      let serverA;
      let instanceA;
      let serverB;
      let instanceB;
      let observed;

      before((done) => {
        serverA = express();
        tracerA = createTracer({
          url: 'http://localhost:9411',
        });
        serverA.use(tracerA.getExpressMiddleware());
        serverB = express();
        tracerB = createTracer({
          url: 'http://localhost:9411',
        });
        serverB.use(tracerB.getExpressMiddleware());
        serverB.get('/', (req, res) => {
          res.json(req.context);
        });
        request = createRequest({ tracer: tracerA.getTracer() });
        instanceB = serverB.listen();
        instanceB.on('listening', () => {
          serverA.get('/b', (req, res) => {
            request(
              'service-b',
              `http://localhost:${instanceB.address().port}`,
            ).then((response) => {
              res.json({
                a: req.context,
                b: response.body,
              });
            });
          });
          instanceA = serverA.listen();
          instanceA.on('listening', () => {
            superagent
              .get(`http://localhost:${instanceA.address().port}/b`)
              .then(({ body }) => {
                observed = body;
              })
              .catch((err) => {
                // tslint:disable-next-line no-console
                console.error(err.status, err.message);
              })
              .then(done);
          });
        });
      });

      after(() => {
        instanceB.close();
        instanceA.close();
      });

      it('maintains the same trace ID', () => {
        expect(observed.a.traceId).to.deep.equal(observed.b.traceId);
      });

      it('passes the spanId from one server to the other\'s parent', () => {
        expect(observed.a.spanId).to.deep.equal(observed.b.parentId);
      });

      it('has the same span and parent in the first server', () => {
        expect(observed.a.spanId).to.deep.equal(observed.a.parentId);
      });

      it('has a different span and parent in the subsequent servers', () => {
        expect(observed.b.spanId).to.not.deep.equal(observed.b.parentId);
      });
    });
    // / with tracer

    context('without tracer', () => {
      let tracerA;
      let tracerB;
      let request;
      let serverA;
      let instanceA;
      let serverB;
      let instanceB;
      let observed;

      before((done) => {
        serverA = express();
        tracerA = createTracer();
        serverA.use(tracerA.getExpressMiddleware());
        serverB = express();
        tracerB = createTracer();
        serverB.use(tracerB.getExpressMiddleware());
        serverB.get('/', (req, res) => {
          res.json(req.context);
        });
        request = createRequest();
        instanceB = serverB.listen();
        instanceB.on('listening', () => {
          serverA.get('/b', (req, res) => {
            request(
              `http://localhost:${instanceB.address().port}`,
            ).then((response) => {
              res.json({
                a: req.context,
                b: response.body,
                r: response,
              });
            });
          });
          instanceA = serverA.listen();
          instanceA.on('listening', () => {
            superagent
              .get(`http://localhost:${instanceA.address().port}/b`)
              .then(({body}) => {
                observed = body;
              })
              .catch((err) => {
                // tslint:disable-next-line no-console
                console.error(err.status, err.message);
              })
              .then(done);
          });
        });
      });

      after(() => {
        instanceB.close();
        instanceA.close();
      });

      it('does not maintain the trace ID', () => {
        expect(observed.a.traceId).to.not.deep.equal(observed.b.traceId);
      });

      it('does not link parent and child span', () => {
        expect(observed.a.spanId).to.not.deep.equal(observed.b.parentId);
      });

      it('is independent of each other\'s span ID', () => {
        expect(observed.a.spanId).to.deep.equal(observed.a.parentId);
        expect(observed.b.spanId).to.deep.equal(observed.b.parentId);
      });

      it('returns the response headers', () => {
        expect(observed.r).to.have.property('headers');
      });

      it('returns the status code', () => {
        expect(observed.r).to.have.property('status');
      });

      it('returns the request URL', () => {
        expect(observed.r).to.have.property('url');
      });
    });
    // / without tracer
  });
  // / integration
});
