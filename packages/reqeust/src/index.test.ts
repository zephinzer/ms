import * as chai from 'chai';
import * as express from 'express';
import * as superagent from 'superagent';
import {createRequest} from './';
import {createTracer} from '@usvc/tracer';

const {expect} = chai;

describe('@usvc/request', () => {
  context('integration', () => {
    let tracerA;
    let tracerB;
    let request;
    let serverA;
    let instanceA;
    let serverB;
    let instanceB;
    let results;

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
      request = createRequest({ tracer: tracerA.getTracer() });
      instanceB = serverB.listen();
      instanceB.on('listening', () => {
        serverA.get('/b', (req, res) => {
          request(
            'service-b',
            `http://localhost:${instanceB.address().port}`
          ).then((response) => {
            res.json({
              a: req.context,
              b: response,
            });
          });
        });
        instanceA = serverA.listen();
        instanceA.on('listening', () => {
          superagent
            .get(`http://localhost:${instanceA.address().port}/b`)
            .then(({ body }) => {
              results = body;
            })
            .catch((err) => {
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
      expect(results.a.traceId).to.deep.equal(results.b.traceId);
    });

    it('passes the spanId from one server to the other\'s parent', () => {
      expect(results.a.spanId).to.deep.equal(results.b.parentId);
    });

    it('has the same span and parent in the first server', () => {
      expect(results.a.spanId).to.deep.equal(results.b.parentId);
    });

    it('has a different span and parent in the subsequent servers', () => {
      expect(results.b.spanId).to.not.deep.equal(results.b.parentId);
    });
  });
});
