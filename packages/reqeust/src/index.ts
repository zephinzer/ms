import fetch from 'node-fetch';
import * as zipkin from 'zipkin';
import * as zipkinInstrumentFetch from 'zipkin-instrumentation-fetch';
import { url } from 'inspector';

export interface CreateRequest {
  format?: 'buffer' | 'json' | 'raw' | 'text';
  tracer?: zipkin.Tracer;
}

export type RequestPromise<T> = (
  remoteServiceName: string,
  url: string,
  options?: object,
) => Promise<T>;

/**
 * Creates the request object. If :tracer is not specified, this function
 * returns a normal `fetch`
 *
 * @param {String} format
 * @param {zipkin.Tracer} tracer
 */
export function createRequest({
  format = 'json',
  tracer = null,
}: CreateRequest = {}): RequestPromise<object> {
  return (tracer !== null)
    ? (remoteServiceName, url, options) =>
      zipkinInstrumentFetch(fetch, {tracer, remoteServiceName})(url, options)
      .then((v) => (format === 'raw') ? v : {...v, body: v[format]()})
    : (url, options) =>
      fetch(url, options)
      .then((v) => (format === 'raw') ? v : {...v, body: v[format]()})
}
