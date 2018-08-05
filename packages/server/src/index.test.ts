import {expect} from 'chai';
import {createServer} from './';
import * as supertest from 'supertest';

describe('@usvc/server', () => {
  describe('middleware hooks', () => {
    let server;

    describe('before', () => {
      before(() => {
        server = createServer({
          middlewares: {
            before: [
              (_req, res) => {
                res
                  .status(418)
                  .json('you\'re not getting past this teapot');
              },
            ],
          },
        });
      });

      it('works', () =>
        supertest(server)
          .get('/')
          .expect('x-powered-by', 'Express') // no http security
          .expect(418),
      );
    });

    describe('after', () => {
      before(() => {
        server = createServer({
          middlewares: {
            after: [
              (_req, res) => {
                res
                  .status(418)
                  .json('you\'re not getting past this teapot');
              },
            ],
          },
        });
      });

      it('works', () =>
        supertest(server)
          .get('/')
          .expect(418)
          .then(({header}) => {
            expect(header['x-powered-by'])
              .to.not.exist; // http security applied
          }),
      );
    });
  });
  // / middleware hooks

  describe('integration tests', () => {
    it('works', () => {
      expect(() => {
        createServer();
      }).to.not.throw();
    });

    context('with configuration', () => {
      const data = {
        a: 1, b: '2', c: true, d: {
          A: 1, B: '2', C: false,
        },
      };
      let server;

      describe('cors', () => {
        context('urls', () => {
          before(() => {
            server = createServer({
              cors: {
                urls: ['localhost'],
              },
            });
            server.get('/', (_req, res) => {
              res.json('ok');
            });
          });

          it('can have custom allowed urls', () =>
            Promise.all([
              supertest(server)
                .get('/')
                .set('Origin', 'remotehost')
                .expect(401)
                .then(() => true),
              supertest(server)
                .get('/')
                .set('Origin', 'localhost')
                .expect(200)
                .then((response) => {
                  expect(response.header['access-control-allow-origin'])
                    .to.deep.equal('localhost');
                  return true;
                }),
              supertest(server)
                .options('/')
                .set('Origin', 'localhost')
                .expect(200)
                .then((response) => {
                  expect(response.header['access-control-allow-origin'])
                    .to.deep.equal('localhost');
                  expect(response.header['access-control-allow-credentials'])
                  .to.deep.equal('true');
                  expect(response.header['access-control-allow-methods'])
                    .to.deep.equal('GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
                  expect(response.header['access-control-max-age'])
                    .to.deep.equal('86400000');
                  return true;
                }),
            ]).then((results) => {
              results.forEach((result) => {
                expect(result).to.deep.equal(true);
              });
            }),
          );
        });
        // / urls

        context('preflight continue', () => {
          const optionsSuccessStatus = 999;
          let results;

          before(() =>
            supertest(createServer({
              cors: {
                optionsSuccessStatus,
                preflightContinue: false,
              },
            }))
            .options('/')
            .then((response) => {
              results = response;
            }),
          );

          it('returns the :optionsSuccessStatus value', () => {
            expect(results.status).to.deep.equal(optionsSuccessStatus);
          });

          it('does not disrupt other defaults', () => {
            expect(results.header['access-control-allow-credentials'])
              .to.deep.equal('true');
            expect(results.header['access-control-allow-methods'])
            .to.deep.equal('GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
          });
        });
      });
    });
    // / with configuration

    context('with defaults', () => {
      const data = {
        a: 1, b: '2', c: true, d: {
          A: 1, B: '2', C: false,
        },
      };
      let server;

      before(() => {
        server = createServer();
        server.post('/', (req, res) => {
          res.json(req.body);
        });
        server.get('/_cookies', (req, res) => {
          res.json(req.cookies);
        });
        server.post('/_cookies', (req, res) => {
          req.session.views = (req.session.views || 0) + 1;
          res.json(req.session.views);
        });
      });

      it('is cors enabled', () =>
        Promise.all([
          supertest(server)
            .options('/')
            .expect(200)
            .then(({header}) => {
              return (
                (header['access-control-allow-credentials'] !== undefined)
                && (header['access-control-allow-methods'] !== undefined)
                && (header['access-control-max-age'] !== undefined)
              );
            }),
          supertest(server)
            .options('/')
            .set('Origin', 'http://localhost')
            .expect(200)
            .catch((error) => true),
        ]).then((results) => {
          results.forEach((result) => {
            expect(result).to.deep.equal(true);
          });
        }),
      );

      it('parses json body data', () =>
        supertest(server)
          .post('/')
          .set('Content-Type', 'application/json')
          .send(data)
          .expect(200)
          .then(({body}) => {
            expect(body).to.deep.equal(data);
          }),
      );

      it('parses url encoded body data', () =>
        supertest(server)
          .post('/')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(data)
          .expect(200)
          .then(({body}) => {
            expect(body.a).to.deep.equal(data.a.toString());
            expect(body.b).to.deep.equal(data.b.toString());
            expect(body.c).to.deep.equal(data.c.toString());
            expect(body.d.A).to.deep.equal(data.d.A.toString());
            expect(body.d.B).to.deep.equal(data.d.B.toString());
            expect(body.d.C).to.deep.equal(data.d.C.toString());
          }),
      );

      it('generates cookies', () =>
        supertest(server)
          .post('/_cookies')
          .expect(200)
          .then(({header}) => header['set-cookie'])
          .then((cookies) =>
            supertest(server)
              .post('/_cookies')
              .set('Cookie', cookies)
              .expect(200),
          )
          .then(({body}) => {
            expect(body).to.deep.equal(2);
          }),
      );

      it('parses cookies', () =>
        supertest(server)
          .get('/_cookies')
          .set('Cookie', 'a=1; b=c; d=true;')
          .expect(200)
          .then(({body}) => {
            expect(body).to.deep.equal({
              a: '1', b: 'c', d: 'true',
            });
          }),
      );
    });
    // / with defaults
  });
});
