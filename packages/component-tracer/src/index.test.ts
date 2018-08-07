import {expect} from 'chai';
import * as sinon from 'sinon';
import * as express from 'express';
import * as supertest from 'supertest';
import {createTracer} from '../src';

describe('@joeir/tracer', () => {
  let mockZipkin;
  let server;
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
    beforeEach(() => {
      server = express();
      server.use(tracer.getExpressMiddleware());
    });

    it('adds a .context property', () => {
      server.get('/', (req, res) => {
        expect(req).to.include.keys('context');
        expect(req.context).to.include.keys([
          'traceId',
          'parentId',
          'spanId',
          'sampled',
        ]);
        res.json('ok');
      });
      return supertest(server)
        .get('/')
        .expect(200);
    });

    it('allows the context to be accessed correctly', () => {
      server.get('/', (req, res) => {
        expect(req.context).to.include.keys([
          'traceId',
          'parentId',
          'spanId',
          'sampled',
        ]);
        res.json('ok');
      });
      return supertest(server)
        .get('/')
        .expect(200);
    });
  });
});
