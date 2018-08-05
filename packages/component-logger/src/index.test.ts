import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as winston from 'winston';
import {logger} from './';

chai.use(sinonChai);
const {expect} = chai;

describe('@joeir/logger-application', () => {
  it('increases the count for every time init() is called', () => {
    const initialCount = logger.count;
    logger.initialize();
    expect(logger.count).to.equal(initialCount + 1);
  });

  describe('.initialize()', () => {
    it('creates a logger instance with the specified instance', () => {
      const formatterSpy = sinon.spy();
      const format = (info) => {
        formatterSpy(info);
        return info;
      };
      const message = 'sss';
      const levels = {a: 1, b: 0};
      const level = 'b';
      const transport = new winston.transports.Console();
      logger.initialize({
        id: '_test',
        formats: [format],
        levels,
        level,
        setPrimary: true,
        transports: [transport],
      });
      expect(logger._instances._test).to.exist;
      expect(logger._instances._test.levels).to.equal(levels);
      expect(logger._instances._test.level).to.equal(level);

      logger.a(message);
      expect(formatterSpy).to.be.calledOnce;
      expect(formatterSpy).to.be.calledWith(
        sinon.match((v) => v.message === message),
      );
    });
  });
});
