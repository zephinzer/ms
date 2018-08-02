import * as chai from 'chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {createMiddleware} from './http';

const {expect} = chai;

describe('@usvc/server/security/http', () => {
  let server;
  let observed;

  before(() => {
    server = express();
    server.use(createMiddleware());
    server.get('/', (req, res) => {
      res.json('ok')
    })
    return supertest(server)
      .get('/')
      .expect(200)
      .then((response) => {
        observed = response['headers'];
      })
  });

  it('hides any indication of express', () => {
    Object.keys(observed).forEach((header) => {
      expect(header).to.not.match(/(e|E)xpress/);
      expect(observed[header]).to.not.match(/(e|E)xpress/);
    });
  });

  it('denies browser dns prefetching', () => {
    expect(observed).to.have.property('x-dns-prefetch-control');
    expect(observed['x-dns-prefetch-control']).to.equal('off');
  });

  it('prevents clickjacking', () => {
    expect(observed).to.have.property('x-frame-options');
    expect(observed['x-frame-options']).to.equal('SAMEORIGIN');
  });

  it('implements HTTP strict transport security', () => {
    expect(observed).to.have.property('strict-transport-security');
    expect(observed['strict-transport-security']).to.equal('max-age=15552000; includeSubDomains');
  });

  it('sets download options for IE8+', () => {
    expect(observed).to.have.property('x-download-options');
    expect(observed['x-download-options']).to.equal('noopen');
  });

  it('stops page from loading when XSS is detected', () => {
    expect(observed).to.have.property('x-xss-protection');
    expect(observed['x-xss-protection']).to.equal('1; mode=block');
  });
});
