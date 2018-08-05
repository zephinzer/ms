import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as express from 'express';
import * as supertest from 'supertest';
import {
  createMiddleware,
  provisionCspReportingMiddleware,
} from './csp';

chai.use(sinonChai);
const {expect} = chai;

describe('@usvc/server/security/csp', () => {
  const logger = {
    info: null,
  };
  const observed = {
    cspHeaders: null,
    cspReportResponse: null,
  };
  let server;

  before(() => {
    logger.info = sinon.spy();
    server = express();
    server.use(createMiddleware({
      childSrc: ['http://test.child-src.com'],
      connectSrc: ['http://test.connect-src.com'],
      defaultSrc: ['http://test.default-src.com'],
      fontSrc: ['http://test.font-src.com'],
      imgSrc: ['http://test.img-src.com'],
      objectSrc: ['http://test.object-src.com'],
      reportUri: '/__report_csp_uri',
      scriptSrc: ['http://test.script-src.com'],
      styleSrc: ['http://test.style-src.com'],
    }));
    provisionCspReportingMiddleware({
      application: server,
      reportUri: '/__report_csp_url',
      logger,
      logLevel: 'info',
    });
    return Promise.all([
      supertest(server)
        .get('/')
        .then(({header}) => {
          observed.cspHeaders = header;
        }),
      supertest(server)
        .post('/__report_csp_url')
        .send({hello: 'world'})
        .then((response) => {
          observed.cspReportResponse = response;
        }),
    ]);
  });

  context('CSP headers', () => {
    let cspHeaders;

    before(() => {
      cspHeaders = observed.cspHeaders['x-content-security-policy'];
    });

    it('sets child-src', () => {
      expect(cspHeaders).to.contain('child-src http://test.child-src.com');
    });

    it('sets connect-src', () => {
      expect(cspHeaders).to.contain('connect-src http://test.connect-src.com');
    });

    it('sets default-src', () => {
      expect(cspHeaders).to.contain('default-src http://test.default-src.com');
    });

    it('sets font-src', () => {
      expect(cspHeaders).to.contain('font-src http://test.font-src.com');
    });

    it('sets img-src', () => {
      expect(cspHeaders).to.contain('img-src http://test.img-src.com');
    });

    it('sets object-src', () => {
      expect(cspHeaders).to.contain('object-src http://test.object-src.com');
    });

    it('sets script-src', () => {
      expect(cspHeaders).to.contain('script-src http://test.script-src.com');
    });

    it('sets style-src', () => {
      expect(cspHeaders).to.contain('style-src http://test.style-src.com');
    });

    it('sets the report-uri', () => {
      expect(cspHeaders).to.contain('report-uri /__report_csp_uri');
    });

    it('sets the sandbox', () => {
      expect(cspHeaders).to.contain('sandbox allow-forms allow-scripts');
    });
  });
  // / CSP headers

  context('CSP reporter', () => {
    let cspReportResponse;

    before(() => {
      cspReportResponse = observed.cspReportResponse;
    });

    it('works as expected', () => {
      expect(cspReportResponse.status).to.deep.equal(204);
    });
  });
  // / CSP reporter
});
