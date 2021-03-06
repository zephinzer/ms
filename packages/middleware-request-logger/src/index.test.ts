import * as express from 'express';
import * as supertest from 'supertest';
import * as superagent from 'superagent';
import {Server} from 'http';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {createMiddleware, ExtendedRequest} from './';

chai.use(sinonChai);
const {expect} = chai;

interface LoggerMock {
  [key: string]: sinon.SinonSpy;
}

describe('@joeir/logger-request', () => {
  const loggerMock: LoggerMock = {};
  let server: express.Application;
  let instance: Server;

  before(() => {
    loggerMock.mock = sinon.spy();
    loggerMock.info = sinon.spy();
  });

  beforeEach(() => {
    server = express();
  });

  afterEach(() => {
    if (instance) {
      instance.close();
    }
    Object.keys(loggerMock).forEach((key) => {
      loggerMock[key].resetHistory();
    });
  });

  it('has the correct log paremeters', (done) => {
    server.use(createMiddleware({
      logger: loggerMock, // to validate the logging
    }));
    server.get('/', (_req, res) => {
      res.json('ok');
    });
    instance = server.listen(() => {
      superagent
        .get(`http://localhost:${instance.address()['port']}`)
        .end((err, response) => {
          expect(loggerMock.info).to.be.calledOnce;
          expect(loggerMock.info).to.be.calledWith(
            sinon.match(({
              level,
              method,
              url,
              status,
              contentLength,
              responseTimeMs,
              httpVersion,
              userAgent,
            }) => (
              level === 'access'
              && method === 'GET'
              && url === '/'
              && status === '200'
              && contentLength === '4'
              && httpVersion === '1.1'
              && !isNaN(Math.floor(responseTimeMs))
              && (userAgent.match(/^node-superagent/gi) !== null)
            )),
          );
          instance.close();
          done();
        });
    });
  });

  context('integration', () => {
    describe('basic', () => {
      it('works', () => {
        expect(() => createMiddleware()).to.not.throw();
        server.use(createMiddleware({
          logger: loggerMock, // to validate the logging
        }));
        server.get('/', (_req, res) => {
          res.json('ok');
        });
        return supertest(server)
          .get('/')
          .expect(200)
          .then(() => {
            [
              (log) => log.level === 'access',
              (log) => log.method === 'GET',
              (log) => log.url === '/',
              (log) => !isNaN(Math.floor(log.status)),
              (log) => !isNaN(Math.floor(log.contentLength)),
              (log) => !isNaN(Math.floor(log.responseTimeMs)),
              (log) => !isNaN(Math.floor(log.httpVersion)),
              (log) => typeof log.remoteHostname !== 'undefined',
              (log) => typeof log.serverHostname !== 'undefined',
              (log) => typeof log.time !== 'undefined',
              (log) => typeof log.userAgent !== 'undefined',
            ].forEach((supposedMatch) => {
              expect(loggerMock.info).to.be.calledWith(
                sinon.match(supposedMatch),
              );
            });
          });
      });
    });

    describe('extensions', () => {
      it('works', () => {
        const arbitraryNumber = Math.floor(Math.random() * 100000);
        const mockHostname = '__test_hostname';
        server.use((req: ExtendedRequest, _res, next) => {
          req.arbitrary = arbitraryNumber;
          next();
        });
        server.use(createMiddleware({
          additionalTokens: [
            {
              id: 'arbitrary-log',
              fn: (req, res) => req.arbitrary,
            },
          ],
          hostname: mockHostname,
          logger: loggerMock,
          level: 'mock',
        }));
        server.get('/', (req: ExtendedRequest, res) => {
          expect(req.arbitrary).to.exist;
          expect(req.arbitrary).to.equal(arbitraryNumber);
          res.json('ok');
        });
        return supertest(server)
          .get('/')
          .expect(200)
          .then((response) => {
            expect(response.body).to.equal('ok');
            expect(loggerMock.mock).to.be.calledOnce;
            expect(loggerMock.mock).to.be.calledWith(
              sinon.match((val) =>
                val.arbitraryLog === arbitraryNumber),
            );
            expect(loggerMock.mock).to.be.calledWith(
              sinon.match((val) =>
                val.serverHostname === mockHostname),
            );
          });
      });
    });
  });
});
