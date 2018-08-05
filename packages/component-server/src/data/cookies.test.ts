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
  });

  context('issuing cookies', () => {
    const endpoint = '/_issue_cookies';

    before(() => {
      server.get(endpoint, (req, res) => {
        const {views} = req.session;
        req.session.issuedAt = (new Date()).toISOString();
        req.session.views = (views ? views : 0) + 1;
        res.json(req.session);
      });
    });

    it('issues correctly', () =>
      supertest(server)
        .get(endpoint)
        .then(({header}) => {
          // tslint:disable-next-line no-unused-expression
          expect(header['set-cookie']).to.not.be.undefined;
        }),
    );

    it('reads and re-issues correctly', () =>
      supertest(server)
        .get(endpoint)
        .then(({header}) => header['set-cookie'])
        .then((cookies) =>
          supertest(server)
            .get(endpoint)
            .set('Cookie', cookies),
        )
        .then(({body}) => {
          expect(body).to.have.property('views');
          expect(body.views).to.deep.equal(2);
        }),
    );
  });

  context('parsing cookies', () => {
    const endpoint = '/_parse_cookies';

    before(() => {
      server.get(endpoint, (req, res) => {
        res.json(req.cookies);
      });
    });

    it('works correctly', () =>
      supertest(server)
        .get(endpoint)
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
        }),
    );
  });
  // / parsing cookies
});
