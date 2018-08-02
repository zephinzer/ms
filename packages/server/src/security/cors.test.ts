import * as chai from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {createMiddleware} from './cors';

const {expect} = chai;

describe('@usvc/server/security/cors', () => {
  let server;
  let observed;

  before(() => {
    server = express();
    server.use(createMiddleware({
      allowedHeaders: ['Authorization'],
      credentials: true,
      exposedHeaders: ['content-type'],
      maxAge: 1000 * 60,
      methods: ['GET'],
      urls: ['http://_test.website']
    }));
    server.get('/', (req, res) => {
      res.json('ok')
    })
    return supertest(server)
      .options('/')
      .set('Origin', 'http://_test.website')
      .expect(200)
      .then((response) => {
        observed = response['headers'];
      })
  });

  it('sets the credentials correctly', () => {
    expect(observed).to.have.property('access-control-allow-credentials');
    expect(observed['access-control-allow-credentials']).to.deep.equal('true');
  });

  it('sets the allowed headers', () => {
    expect(observed).to.have.property('access-control-allow-headers');
    expect(observed['access-control-allow-headers']).to.deep.equal('Authorization');
  });

  it('sets the allowed methods', () => {
    expect(observed).to.have.property('access-control-allow-methods');
    expect(observed['access-control-allow-methods']).to.deep.equal('GET');
  });

  it('sets the allowed origin', () => {
    expect(observed).to.have.property('access-control-allow-origin');
    expect(observed['access-control-allow-origin']).to.deep.equal('http://_test.website');
  });

  it('sets the max age', () => {
    expect(observed).to.have.property('access-control-max-age');
    expect(observed['access-control-max-age']).to.deep.equal('60000');
  });
});
