# `@usvc/server`
Creates a bootstrapped server based on Express.

## Scope

- [x] Basic HTTP security
- [x] Support for reading cookies
- [x] Support for issuing cookies
- [x] Parses POST data with `Content-Type: application/json` correctly
- [x] Parses POST data with `Content-Type: application/x-www-form-urlencoded` correctly
- [x] Support for Cross-Origin-Resource-Sharing (CORS)
- [x] Support for Content-Security-Policy (CSP) management
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
  cookies: {
    keys: [],
    name: 'session',
    secret: undefined,
    domain: 'localhost',
    httpOnly: true,
    maxAge: 60e3 * 60,
    path: '/',
  },
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
  csp: {
    childSrc: ['"self"'],
    connectSrc: ['"self"'],
    defaultSrc: ['"self"'],
    disableAndroid: false,
    fontSrc: ['"self"'],
    imgSrc: ['"self"'],
    logger: console,
    logLevel: 'warn',
    objectSrc: ['"none"'],
    reportUri: '/csp-report',
    sandbox: ['allow-forms', 'allow-scripts'],
    scriptSrc: ['"self"'],
    styleSrc: ['"self"'],
  },
  jsonBody: {
    limit: '100kb',
    type: '*/json',
  },
  urlEncodedBody: {
    limit: '100kb',
    type: '*/x-www-form-urlencoded',
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
| `cookies` | [DataCookieOptions](#options-for-cookies-datacookiesoptions) | Options for configuring cookies management |
| `cors` | [SecurityCorsOptions](#options-for-cors-securitycorsoptions) | Options for configuring CORS |
| `jsonBody` | [DataJsonOptions](#options-for-jsonbody-datajsonoptions) | - | Options for configuring parsing of JSON body data |
| `logger` | Object | `console` | The logger to use for this server instance |
| `urlEncodedBody` | [DataUrlEncodedOptions](#options-for-jsonbody-dataurlencodedoptions) | Options for configuring parsing of URL encoded body data |

## Options Documentation

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

### Options for `cors` (`SecurityCorsOptions`)

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

### Options for `csp` (`SecurityCspOptions`)

| Key | Type | Defaults To | Description |
| --- | --- | --- | --- |
| `childSrc` | String[] | `['"self"']` | Sets the `child-src` in the CSP |
| `connectSrc` | String[] | `['"self"']` | Sets the `connect-src` in the CSP |
| `defaultSrc` | String[] | `['"self"']` | Sets the `default-src` in the CSP |
| `disableAndroid` | Boolean | `false` | |
| `fontSrc` | String[] | `['"self"']` | Sets the `font-src` in the CSP |
| `imgSrc` | String[] | `['"self"']` | Sets the `img-src` in the CSP |
| `logger` | Object | `console` | The logger object to use for logging |
| `logLevel` | String | `"warn"` | The log level to use with the logger object. If this level is not found as a property of the logger object, an error will be thrown at runtime |
| `objectSrc` | String[] | `['"none"']` | Sets the `object-src` in the CSP |
| `reportUri` | URI | `"/csp-report"` | Sets the `report-uri` in the CSP where browsers will post to if a CSP violation is found. |
| `sandbox` | String[] | `['allow-forms', 'allow-scripts]` | Sets the `sandbox` in the CSP |
| `scriptSrc` | String[] | `['"self"']` | Sets the `script-src` in the CSP |
| `styleSrc` | String[] | `['"self"']` | Sets the `style-src` in the CSP |

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
- Added cookie sessions
- Added CSP support

### 0.x

#### 0.0.2
- Cross Origin Resource Sharing (CORS) support

#### 0.0.1
- Cookie parsing
- Basic HTTP header security
- Parsing of JSON encoded boday data
- Parsing of URL encoded body data

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| Joseph | - | https://github.com/zephinzer | - |

# Cheers
