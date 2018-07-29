import {expect} from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {createTracer} from '../src';

describe('@joeir/tracer', () => {
  let server;
  let tracer;

  beforeEach(() => {
    tracer = createTracer({
      url: 'http://localhost:9411'
    });
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