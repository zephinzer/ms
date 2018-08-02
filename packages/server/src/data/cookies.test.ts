import * as chai from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {createMiddleware} from './cookies';

const {expect} = chai;

describe('@usvc/server/data/cookies', () => {
  let server;

  before(() => {
    server = express();
    server.use(createMiddleware());
    server.get('/', (req, res) => {
      res.json(req.cookies);
    });
  });

  it('works', () =>
    supertest(server)
      .get('/')
      .set('Cookie', [
        'hello=world',
        'one=1',
        'bool=true',
        '2=two',
      ].join(';'))
      .then(({body}) => {
        expect(body).to.have.property('hello');
        expect(body.hello).to.deep.equal('world');
        expect(body).to.have.property('one');
        expect(body.one).to.deep.equal('1');
        expect(body).to.have.property('bool');
        expect(body.bool).to.deep.equal('true');
        expect(body).to.have.property('2');
        expect(body['2']).to.deep.equal('two');
      })
  );
});
