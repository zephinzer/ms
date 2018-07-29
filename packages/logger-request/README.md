# `@usvc/logger-request`
Morgan based logger for usage in a microservices architecture.

The output logs will include the following properties:

| Key | Description |
| --- | --- |
| level | This will always be `"access"` |
| method | The method of the HTTP request |
| url | The requested URL |
| status | The status code of the request |
| contentLength | The content length |
| responseTimeMs | The response time in milliseconds |
| httpVersion | The HTTP version |
| referrer | The referrer (if applicable) |
| remoteHostname | The remote hostname (if found) |
| remoteAddress | The remote IP address |
| serverHostname | The server hostname as specified in the `createLogger` method |
| time | ISO timestamp of the request |
| userAgent | User agent of the request |

## Scope

- [x] Creates an Express compatible request logger middleware
- [x] Allow for token extension
- [x] Allow for specification of a custom logger and log level

## Installation

```bash
npm i @usvc/logger-request;
# OR
yarn add @usvc/logger-request;
```

## Usage

```js
// es5:
const {createLogger} = require('@usvc/logger-request');
// es6:
import {createLogger} from '@usvc/logger-request';
```

### Basic

```js
const express = require('express');
// require as ^
const app = express();
app.use(createLogger());
app.listen(...);
```

### Full Configuration

```js
const express = require('express');
// require as ^
const app = express();
app.use(createLogger({

}));
app.listen(...);
```


## API Documentaiton

### `createLogger(:options)`
Creates the request logger middleware and returns an Express compatible middleware that you can `app.use(...)`.

**Parameters**

| Key | Defaults To | Description |
| --- | --- | --- |
| `additionalTokens` | `[]` | Additional tokenizers. Each item in the array should be of the form `{id: 'some-property', fn: (req, res) => (/*your code here*/)}`. |
| `hostname` | `os.hostname() || process.env.HOSTNAME || 'unknown'` | The host name to use for the server in the logs |
| `logger` | `console` | The logger to be used. |
| `level` | `info` | The level of the logger to be used. |

### `getZipkinTokenizers()`
This function returns an array of tokenizers that you can use in the `additionalTokenizers` option in `createLogger()`.

These tokenizers depend on there being a `.context` property in the `Request` object passed by Express. This is automatically done if you are using the Zipkin tracer as defined in [`@usvc/tracer`](../tracer).

Using the returned tokenizers will result in the following additional keys in the log:

| Key | Description |
| --- | --- |
| `traceId` | The trace ID |
| `spanId` | The span ID |
| `parentSpanId` | The parent span ID |
| `sampled` | Indication whether the request was sampled or not |

## Examples

### Usage with ES5
Goto: [./example/es5](./example/es5)

Or run: `npm run eg:es5`

### Usage with ES6
Goto: [./example/es6](./example/es6)

Or run: `npm run eg:es6`

### Usage with Winston
Goto: [./example/winston](./example/winston)

Or run: `npm run eg:winston`

## Development

See the [development instructions on the main repository's README](../../README.md#development).

## License

This package is licensed under the MIT license.

View the license at [LICENSE](./LICENSE).

## Changelog

WIP

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| Joseph | dev-at-joeir-dot-net | https://github.com/zephinzer | N/A |

# Cheers
