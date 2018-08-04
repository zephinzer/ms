# `@usvc/server`
Creates a bootstrapped server based on Express.

## Scope

- [x] Basic HTTP security
- [x] Support for cookies management
- [x] Parses POST data with `Content-Type: application/json` correctly
- [x] Parses POST data with `Content-Type: application/x-www-form-urlencoded` correctly
- [x] Support for Cross-Origin-Resource-Sharing (CORS)
- [ ] Support for Content-Security-Policy (CSP) management
- [ ] Bundled distributed tracing with Zipkin
- [ ] Bundled metrics supporting Prometheus
- [ ] Readiness check configuration
- [ ] Liveness check configuration

## Installation

```bash
npm i @usvc/server;
# OR
yarn add @usvc/server;
```

## Usage

```js
const {createServer} = require('@usvc/server');
// OR
import {createServer} from '@usvc/server';
```

### Basic

```js
// require as ^
const server = createServer();
const instance = server.listen(() => {
  const {port} = instance.address;
  console.info(`Listening on http://localhost:${port}`)
});
```

### Full Configuration

```js
// require as ^
const server = createServer({
  enableCookies: true,
  enableCors: true,
  enableJsonBody: true,
  enableUrlEncodedBody: true,
  cors: {
    allowedHeaders: undefined,
    credentials: true,
    exposedHeaders: undefined,
    maxAge: ONE_DAY,
    methods: ALL_HTTP_METHODS,
    optionsSuccessStatus: 204,
    preflightContinue: true,
    urls: [],
  },
  jsonBody: {
    limit: '100kb',
    type: '*/json',
  },
  urlEncodedBody: {
    limit: '100kb',
    type: '*/x-www-form-urlencoded',
  },
  cookies: {
    keys: [],
    name: 'session',
    secret: undefined,
    domain: 'localhost',
    httpOnly: true,
    maxAge: 60e3 * 60,
    path: '/',
  },
});

const instance = server.listen(() => {
  const {port} = instance.address;
  console.info(`Listening on http://localhost:${port}`)
});
```

## API Documentaiton

### `.createServer(:options)`
Returns a bootstrapped Express server. The `:options` parameter has the following schema:

| Key | Type | Defaults To | Description |
| --- | --- | | --- | --- |
| `enableCookies` | Boolean | `true` | Enables use of `.cookies` and `.session` in the request object in Express handlers |
| `enableJsonBody` | Boolean | `true` | Enables use of `.body` in the request object if the `Content-Type` matches the `:jsonBodyType` parameter |
| `enableUrlEncodedBody` | Boolean | `true` | Enables use of `.body` in the request object if the `Content-Type` matches the `:urlEncodedType` parameter |
| `cors` | [DataCorsOptions](#options-for-cors-datacorsoptions) | Options for configuring CORS |
| `jsonBody` | [DataJsonOptions](#options-for-jsonbody-datajsonoptions) | - | Options for configuring parsing of JSON body data |
| `urlEncodedBody` | [DataUrlEncodedOptions](#options-for-jsonbody-dataurlencodedoptions) | Options for configuring parsing of URL encoded body data |
| `cookies` | [DataCookieOptions](#options-for-cookies-datacookiesoptions) | Options for configuring cookies management |

## Options Documentation

### Options for `cors` (`DataCorsOptions`)

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `allowedHeaders` | String[] | `undefined` | Sets the `Access-Control-Allow-Headers` HTTP response header |
| `credentials` | Boolean | `true` | Specifies if credentials are allowed |
| `exposedHeaders` | String[] | `undefined` | Sets the allowed headers to be exposed |
| `maxAge` | Number | One day | The maximum age of caching in milliseconds |
| `methods` | String[] | All HTTP methods | The allowed HTTP methods |
| `optionsSuccessStatus` | Number | `204` | Specifies the HTTP status code to send on `OPTIONS` success |
| `preflightContinue` | Boolean | `true` | Specifies if the preflight response should be sent immediately (`false`) or not (`true`) |
| `urls` | String[] | `[]` | An array of allowed URLs for which the `Origin` request header can be |

### Options for `jsonBody` (`DataJsonOptions`)

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `limit` | String | `"100kb"` | Maximum size of the JSON body |
| `type` | String | `"*/json"` | Pattern of the `Content-Type` HTTP header value to invoke JSON body parsing |

### Options for `urlEncodedBody` (`DataUrlEncodedOptions`)

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `limit` | String | `"100kb"` | Maximum size of the JSON body |
| `type` | String | `"*/x-www-form-urlencoded"` | Pattern of the `Content-Type` HTTP header value to invoke JSON body parsing |

### Options for `cookies` (`DataCookiesOptions`)

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `keys` | String[] | `[]` | Keys used to sign (index zero) and verify cookies (other index numbers) |
| `name` | String | `"session"` | Name of the cookie |
| `secret` | String | - | Secret used to compute the hash |
| `domain` | String | `"localhost"` | Domain which the cookie is registered on |
| `httpOnly` | Boolean | `true` | Set the HTTP-Only flag or not |
| `maxAge` | Number | `60e3 * 60` | Maximum time the cookie is cacheable |
| `path` | String | `"/"` | Path of the cookie |

## Examples

`WIP`

## Development

`WIP`

## License

This package is licensed under the MIT license.

View the license at [LICENSE](./LICENSE).

## Changelog

### 0.x
### 0.0.4
- Added cookie sessions

### 0.0.2
- Cross Origin Resource Sharing (CORS) support

### 0.0.1
- Cookie parsing
- Basic HTTP header security
- Parsing of JSON encoded boday data
- Parsing of URL encoded body data

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| Joseph | - | https://github.com/zephinzer | - |

# Cheers
