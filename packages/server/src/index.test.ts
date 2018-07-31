import {createServer} from './';
import * as chai from 'chai';
import * as supertest from 'supertest';

const {expect} = chai;

describe('@usvc/server', () => {
  describe('.createServer', () => {
    it('runs without errors', () => {
      expect(() => {
        createServer();
      }).to.not.throw();
    });
  });
  // .createServer

  context('integration', () => {
    const endpoint = '/';
    let server;
    let instance;

    before(() => {
      server = createServer();

      server.get(endpoint, (_r, res) => res.json('ok'));
    });

    after(() => {
      if (instance && typeof instance.close === 'function') {
        instance.close();
      }
    });

    context('HTTP header security', () => {
      let observed;

      before(() =>
        supertest(server)
          .get(endpoint)
          .expect(200)
          .then((response) => {
            observed = response['headers'];
          })
      );

      it('hides any indication of express', () => {
        Object.keys(observed).forEach((header) => {
          expect(header).to.not.match(/(e|E)xpress/);
          expect(observed[header]).to.not.match(/(e|E)xpress/);
        });
      });

      it('denies browser dns prefetching', () => {
        expect(observed).to.contain.keys('x-dns-prefetch-control');
        expect(observed['x-dns-prefetch-control']).to.equal('off');
      });

      it('prevents clickjacking', () => {
        expect(observed).to.contain.keys('x-frame-options');
        expect(observed['x-frame-options']).to.equal('SAMEORIGIN');
      });

      it('implements HTTP strict transport security', () => {
        expect(observed).to.contain.keys('strict-transport-security');
        expect(observed['strict-transport-security']).to.equal('max-age=15552000; includeSubDomains');
      });

      it('sets download options for IE8+', () => {
        expect(observed).to.contain.keys('x-download-options');
        expect(observed['x-download-options']).to.equal('noopen');
      });

      it('stops page from loading when XSS is detected', () => {
        expect(observed).to.contain.keys('x-xss-protection');
        expect(observed['x-xss-protection']).to.equal('1; mode=block');
      });
    });
    // / HTTP header security

    context('POST data handling', () => {
      const endpoint = '/_post_data_handling';
      const testData = {
        number: 1,
        otherNumber: 1.123,
        string: 'string',
        boolean: true,
        object: {
          number: 1,
          otherNumber: 1.123,
          string: 'string',
          boolean: true,
        }
      };
      const flagJson = 'application/json';
      const flagUrlEncoded = 'application/x-www-form-urlencoded';
      const postWithContentType = (flag) =>
        supertest(server)
          .post(endpoint)
          .set('Content-Type', flag)
          .send(testData);
      let observed;

      before(() => {
        server.post(endpoint, (req, res) => res.json(req.body));
        return Promise.all([
          postWithContentType(flagJson)
            .then((result) => ({json: result.body})),
          postWithContentType(flagUrlEncoded)
            .then((result) => ({urlEncoded: result.body})),
        ]).then((results) => {
          observed = results.reduce((i, j) => ({...i, ...j}), {})
        });
      });

      it('parses JSON data corectly', () => {
        expect(observed.json).to.deep.equal(testData);
      });

      it('parses URL Encoded data correctly', () => {
        const {urlEncoded} = observed;
        expect(urlEncoded).to.not.deep.equal(testData);
        expect(urlEncoded).to.have.keys(Object.keys(testData));
        expect(urlEncoded.object).to.have.keys(Object.keys(testData.object));
        Object.keys(urlEncoded).forEach((key) => {
          if (typeof urlEncoded[key] !== 'object') {
            expect(urlEncoded[key]).to.deep.equal(testData[key].toString());
          }
        });
        Object.keys(urlEncoded.object).forEach((key) => {
          if (typeof urlEncoded[key] !== 'object') {
            expect(urlEncoded[key]).to.deep.equal(testData[key].toString());
          }
        });
      });
    });
    // / POST data handling

    context('cookie handling', () => {
      const endpoint = '/_cookie_handling';

      before(() => {
        server.get(endpoint, (req, res) => {
          res.json(req.cookies);
        });
      });

      it('works', () =>
        supertest(server)
          .get(endpoint)
          .set('Cookie', [
            'hello=world',
            'google=duck',
            'number=1',
          ].join(';'))
          .then(({body}) => {
            expect(body).to.have.keys(['hello', 'google', 'number']);
            expect(body.hello).to.deep.equal('world');
            expect(body.google).to.deep.equal('duck');
            expect(body.number).to.deep.equal('1');
          })
      );
    });
    // / cookie handling
  });
  // / integration
});
// / @usvc/server
