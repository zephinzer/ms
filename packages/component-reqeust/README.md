# `@usvc/component-request`
Request module with zipkin instrumentation based on `node-fetch`.

## Scope

- [x] create a Zipkin instrumented request object
- [x] fallback to normal request if no tracer is provided

## Installation

```bash
npm i @usvc/component-request
# OR
yarn add @usvc/component-request
```

## Usage

```js
const {createRequest} = require('@usvc/component-request');
// OR
import {createRequest} from '@usvc/component-request';
```

### Basic

```js
// require as ^
createRequest();
```

### Full Configuration

```js
// require as ^
// with your own tracer:
const tracer = require('./tracer');
// OR if you're using @usvc/tracer:
const {createTracer} = require('@usvc/tracer');
const tracerInstance = createTracer({
  url: 'http://zipkin:9411', // for example only
});
createRequest({
  format: 'json',
  tracer: tracerInstance.getTracer()
});
```

## API Documentaiton

### `.createRequest(:options)`
Returns a request-like function. The `:options` parameter is an object that can accept the following keys:

| Key | Defaults To | Description |
| --- | --- | --- |
| `format` | `"json"` | Decides the format of the response. Possible values are `"buffer"`, `"json"`, and `"text"`. |
| `tracer` | `null` | Defines the tracer we should use. When left as `null`, no distributed tracing will be made available. |

When a `tracer` is specified in the parameters, the function signature of the returned request will be:

```typescript
export type RequestWithTracing = (
  remoteServerName: string,
  url: string,
  options: object,
) => RequestPromise<object>;
```

When no `tracer` is specified, the function signature will lack the `:remoteServiceName` parameter and resemble a standard `fetch` operation:

```typescript
export type RequestWithoutTracing = (
  url: string,
  options: object,
) => RequestPromise<object>;
```

The `UsvcResponse` object returned by the `Promise` has the following schema:

```typescript
export interface UsvcResponse {
  body: object; // response body
  headers: object; // response headers
  status: number; // HTTP status code
  statusText: string; // HTTP status text
  url: string; // request URL
}
```

## Examples

`WIP`

## Development

See [the main README.md](../../README.md).

## License

This package is licensed under the MIT license.

View the license at [LICENSE](./LICENSE).

## Changelog
### 0.0.x
#### 0.0.1
- Initial release

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| Joseph | - | https://github.com/zephinzer | - |

# Cheers
