# `@usvc/tracer`
Distributed trace management package using Zipkin for use in an Express application.

## Scope

- [x] Creation of a tracer
- [x] Allow for configuration of sample rate
- [x] Allow for configuration of headers sent to Zipkin service
- [x] Allow for configuration of Zipkin service URL
- [x] Allow for configuration of trace ID bit count

## Installation

```bash
npm i @usvc/tracer;
# OR
yarn add @usvc/tracer;
```

## Usage

```js
// es5
const {
  createTracer,
  getContextProviderMiddleware,
} = require('@usvc/tracer');

// es6
import {
  createTracer,
  getContextProviderMiddleware,
} from '@usvc/tracer';
```

### Basic

```js
const express = require('express');
// require module as per ^
const tracer = createTracer();
const app = express();
app.use(tracer.getExpressMiddleware());
// ...
```

### Full Configuration

```js
const express = require('express');
// require module as per ^
const tracer = createTracer({
  sampleRate: 1,
  headers: {},
  httpTimeout: 5.0,
  url: 'http://localhost:9411',
  traceId128bit: true,
});
const app = express();
app.use(tracer.getExpressMiddleware());
// ...
```

## API Documentaiton

### `createTracer(:options)`
Creates the tracer object. The `:options` parameter has the following schema:

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `sampleRate` | Number | `1` | The frequency of which to sample requests - 1 means sample everything, 0 means sample nothing |
| `headers` | Object | `{}` | Additional headers to be sent to the Zipkin service - use this to add stuff like `X-Authorization` headers |
| `httpTimeout` | Number | `5.0` | Timeout in seconds for a call to the Zipkin service |
| `url` | URL | `http://localhost:9411` | The base URL of your Zipkin service |
| `traceId128Bit` | Boolean | `true` | Enables 128-bit length trace IDs |

The returned object has the following methods:

| Method | Description |
| --- | --- |
| `getContext()` | Retrieves the internally created context |
| `getExpressMiddleware()` | Retrieves an array of middlewares usable via `express().use(...)` |
| `getTracer()` | Retrieves the raw Zipkin tracer |

### `getContextProviderMiddleware(:options)`
Returns an Express middleware that adds a `.context` property to the Express Request object and passes it downstream. The `:options` has the following schema:

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `context` | `Context<T>` | `undefined` | The context object retrievable via the `.getContext()` method of the object returned by `createTracer()`. Alternatively, can used alone. |

## Examples

`WIP`

## Development

`WIP`

## License

This package is licensed under the MIT license.

View the license at [LICENSE](./LICENSE).

## Changelog

### 0.1.x
#### 0.1.0
- Initial release

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| zephinzer | - | https://github.com/zephinzer | - |

# Cheers
