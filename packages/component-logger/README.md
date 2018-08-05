# `@usvc/component-logger`
An application-level logger using Winston under the hood.

## Scope

- [x] Application logging with timestamp
- [x] Allows for custom levels (with level filtering) definition
- [x] Allows for assigning an ID to the logger
- [x] Allows for extension of Winston transports
- [x] Allows for extension of Winston formats
- [x] Allows for multiple loggers to exist
- [x] Include FluentD transport for logs centralisation
- [x] Include Zipkin's B3 propagation format into logger (`spanId`, `parentSpanId`, `traceId`, `sampled`)

## Installation

```bash
npm i @usvc/component-logger;
# OR
yarn add @usvc/component-logger;
```

## Usage

```js
// es5:
const {logger} = require('@usvc/component-logger');
// es6:
import {logger} from '@usvc/component-logger';
```

### Basic

```js
// require it as per ^
logger.initialize();
logger.info('hi');
```

### Full Configuraiton

```js
// require it as per ^
logger.initialize({
  id: 'logger_id',
  formats: [],
  setPrimary: false,
  levels: {
    rant: 3,
    talk: 2,
    shout: 1,
    scream: 0,
  },
  level: 'rant',
  transports: [logger.createConsoleTransport()],
});
logger.info('hi');
```

## API
The following properties are properties belonging to the imported `{logger}`. You could also `import` them as separate functions.

### `.initialize(:options)`
Initialises a logger but does not return it. When running for the first time, this logger will be the default when you do `logger.info(...)`.

> To access a logger with an ID `'id'`, use `logger.use('id').info(...)`. 

`.initialize` takes in an object for the `:options` with the keys as follows:

**Parameters**

| Key | Defaults To | Description |
| --- | --- | --- |
| `id` | `"instance"` | Id of the logger |
| `formats` | `[]` | An array of Winston transport formatters |
| `setPrimary` | `false` | Defines whether the `logger` object should take on keys corresponding to the levels of the newly defined logger |
| `levels` | `{silly:5000,debug:4000,info:3000,http:2000,warn:1000,error:0}` | Levels of the logger |
| `level` | `"silly"` | Level of the logger |
| `transports` | `[]` | An array of Winston transport objects |

### `.createConsoleTransport()`
Creates a `winston.transports.Console` transport object.

> Use this transport in the `transports` property of the `.initialize()` method.

### `.createFluentTransport()`
Creates a transport object capable of sending logs to a FluentD service. Uses `fluent-logger` under the hood.

> Use this transport in the `transports` property of the `.initialize()` method.

**Parameters**

| Key | Defaults To | Description |
| --- | --- | --- |
| `id` | `"fluent"` | ID of the logger to appear in FluentD |
| `host` | `"localhost"` | Hostname of the FluentD service |
| `port` | `24224` | Port of the FluentD servie |
| `requireAckResponse` | `false` | Determines if we should wait for an ACK by the FluentD service |
| `security` | `{}` | Defines possible security parameters. See below for details |
| `timeout` | `3.0` | Defines the timeout for the FluentD service |
| `tls` | `false` | Determines if TLS should be used |
| `tlsOptions` | `{}` | Options for TLS if `tls` is `true` |

See [https://github.com/fluent/fluent-logger-node#options](https://github.com/fluent/fluent-logger-node#options) for more information. We use a subset of their configurations.

### `.createZipkinContextFormatter()`
Creates a formatter which injects the Zipkin context into every log if it is available. Use this formatter in the `formats` property of the `.initialize()` method.

| Key | Defaults To | Description |
| --- | --- | --- |
| `loggerId` | `null` | The logger ID to be attached to the log object. **REQUIRED** |
| `context` | `null` | The context used for the formatter. This needs to be an `ExplicitContext`. |

## Examples
### Usage with ES5
Goto: [Usage with ES5 (`require`s)](./example/es5)

Run: `npm run eg:es5` in this directory

### Usage with ES6
Goto: [Usage with ES6 (`import`s)](./example/es6)

Run: `npm run eg:es6` in this directory

### Usage with multiple loggers
Goto: [Usage with multiple loggers](./example/multiple)

Run: `npm run eg:multiple` in this directory

### Usage with FluentD logs collector
> Docker Compose needs to be installed for this to work

Goto: [FluentD example](./example/fluentd)

Run: `npm run eg:fluentd` in this directory

> You can run `docker logs -f $(docker ps | grep fluentd | cut -f 1 -d ' ')` to get the container ID of the FluentD service, and then run `docker logs -f ${CONTAINER_ID}` to see the log. It should like: `2018-07-29 07:42:18.000000000 +0000 _test_fluentd: {"message":"hi","level":"info","timestamp":"2018-07-29T07:42:18.360Z"}`

### Usage with Zipkin context
> Docker Compose needs to be installed for this to work

Goto: [Zipkin context example](./example/zipkin)

Run: `npm run eg:zipkin` in this directory

> You can go to http://localhost:9411 to see the zipkin trace.

## Development

`COMING SOON`

## Changelog

### 0.0.x
#### 0.0.1
- Initial release

# Cheers
