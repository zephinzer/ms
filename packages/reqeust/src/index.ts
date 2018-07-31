import fetch from 'node-fetch';
import * as zipkin from 'zipkin';
import * as zipkinInstrumentFetch from 'zipkin-instrumentation-fetch';

export interface CreateRequest {
  format?: 'buffer' | 'json' | 'raw' | 'text',
  tracer?: zipkin.Tracer;
}

export type RequestPromise<T> = (
  remoteServiceName: string,
  url: string,
  options?: object,
) => Promise<T>;

/**
 * 
 * @param {String} format
 * @param {String} url
 */
export function createRequest({
  format = 'json',
  tracer,
}: CreateRequest): RequestPromise<object> {
  return (remoteServiceName, url, options) =>
    zipkinInstrumentFetch(fetch, {tracer, remoteServiceName})
      (url, options).then((v) => (format === 'raw') ? v : v[format]());
};
