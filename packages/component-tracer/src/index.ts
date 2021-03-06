import * as express from 'express';
import {
  BatchRecorder,
  ExplicitContext,
  jsonEncoder,
  option,
  sampler,
  Tracer,
} from 'zipkin';
import {HttpLogger} from 'zipkin-transport-http';
import {expressMiddleware} from 'zipkin-instrumentation-express';

const {JSON_V2} = jsonEncoder;
const {CountingSampler} = sampler;

export function createTracer({
  sampleRate = 1,
  headers = {},
  httpTimeout = 5.0,
  url = 'http://localhost:9411',
  traceId128Bit = true,
}: TracerObjectParameters = {}): TracerObject {
  const ctxImpl = new ExplicitContext();
  const endpoint = `${url}/api/v2/spans`;
  const jsonEncoderInstance = JSON_V2;
  const logger = new HttpLogger(
    {endpoint, headers, httpTimeout, jsonEncoder: jsonEncoderInstance},
  );
  const recorder = new BatchRecorder({logger});
  const samplerInstance = new CountingSampler(sampleRate);
  const tracer = new Tracer(
    {ctxImpl, recorder, sampler: samplerInstance, traceId128Bit},
  );
  const contextProviderMiddleware = getContextProviderMiddleware(ctxImpl);
  const zipkinInstrumentationMiddleware = expressMiddleware({tracer});

  return {
    getContext: () => ctxImpl,
    getExpressMiddleware: () => ([
      zipkinInstrumentationMiddleware,
      contextProviderMiddleware,
    ]),
    getTracer: () => tracer,
  };
}

/**
 * Creates a middleware that attaches a `.context` property
 * to the Express request object. Compatible with the
 * `getZipkinTokenizers()` tokenizer generator in the
 * `@usvc/logger-request` package.
 *
 * @param {ExplicitContext} ctxImpl
 * @return {express.RequestHandler}
 */
export function getContextProviderMiddleware(
  ctxImpl: ExplicitContext,
): ExpressContextualizedRequestHandler {
  return (req, res, next) => {
    const {traceId, parentId, spanId, sampled} = ctxImpl.getContext();
    req.context = {traceId, parentId, spanId, sampled};
    next();
  };
}

export interface TraceContext {
  spanId: string;
  parentId: string;
  traceId: string;
  sampled: option.IOption<boolean>;
}

export interface ExpressContextualizedRequest extends express.Request {
  context: TraceContext;
}

export type ExpressContextualizedRequestHandler = (
  req: ExpressContextualizedRequest,
  res: express.Response,
  next: express.NextFunction,
) => void;

export interface TracerObjectParameters {
  headers?: object;
  httpTimeout?: number;
  sampleRate?: number;
  traceId128Bit?: boolean;
  url?: string;
}

export interface TracerObject {
  getContext: () => ExplicitContext;
  getExpressMiddleware: () => express.RequestHandler[];
  getTracer: () => Tracer;
}
