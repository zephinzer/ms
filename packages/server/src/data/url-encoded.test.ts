import * as chai from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {createMiddleware} from './url-encoded';

const {expect} = chai;

describe('@usvc/server/data/url-encoded', () => {
  let server;

  before(() => {
    server = express();
    server.use(createMiddleware());
    server.post('/', (req, res) => {
      res.json(req.body);
    });
  });

  it('works', () =>
    supertest(server)
      .post('/')
      .send({
        string: 'string',
        number: 1,
        float: 1.1234567,
        boolean: true,
        null: null,
        object: {
          hello: 'world',
        },
      })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .then(({body}) => {
        expect(body).to.have.keys([
          'boolean',
          'float',
          'number',
          'null',
          'object',
          'string',
        ]);
        expect(body.string).to.deep.equal('string');
        expect(body.number).to.deep.equal('1');
        expect(body.float).to.deep.equal('1.1234567');
        expect(body.boolean).to.deep.equal('true');
        expect(body.null).to.deep.equal('');
        expect(body.object).to.deep.equal({
          hello: 'world',
        });
      })
  );
});
