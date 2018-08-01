import fetch from 'node-fetch';
import * as zipkin from 'zipkin';
import * as zipkinInstrumentFetch from 'zipkin-instrumentation-fetch';

export interface CreateRequest {
  format?: 'buffer' | 'json' | 'raw' | 'text';
  tracer?: zipkin.Tracer;
}

export type RequestPromise<T> = (
  remoteServiceName: string,
  url: string,
  options?: object,
) => Promise<T>;

export interface UsvcResponse {
  body: object;
  headers: object;
  status: number;
  statusText: string;
  url: string;
}

export type RequestWithTracing = (
  remoteServerName: string,
  url: string,
  options: object,
) => RequestPromise<UsvcResponse>;

export type RequestWithoutTracing = (
  url: string,
  options: object,
) => RequestPromise<UsvcResponse>;

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
}: CreateRequest = {}): RequestWithTracing | RequestWithoutTracing {
  return (tracer !== null)
    ? ((remoteServiceName, url, options) =>
        zipkinInstrumentFetch(fetch, {tracer, remoteServiceName})(url, options)
        .then((v) => resolveFetchLikeRequest(v, format))
      )
    : ((url, options) =>
        fetch(url, options)
        .then((v) => resolveFetchLikeRequest(v, format))
      );
}

function resolveFetchLikeRequest(rawFetchResponse, format) {
  return new Promise((resolve, reject) => {
    if (format !== 'raw') {
      rawFetchResponse[format]()
        .then((formattedresponse) => {
          resolve({
            body: formattedresponse,
            url: rawFetchResponse.url,
            status: rawFetchResponse.status,
            statusText: rawFetchResponse.statusText,
            headers: (() => {
              const headers = {};
              const headerIterator = (new Map(rawFetchResponse.headers)).entries();
              let header = headerIterator.next().value;
              while(header !== undefined) {
                const headerKey = header[0];
                const headerValue = header[1];
                header = headerIterator.next().value;
                headers[headerKey.toString()] = headerValue;
              }
              return headers;
            })(),
          });
        })
        .catch(reject);
    }
  });
};
