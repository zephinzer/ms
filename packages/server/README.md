# `@usvc/server`
Creates a bootstrapped server based on Express.

## Scope

- [x] Basic HTTP security
- [x] Support for cookies management
- [x] Parses POST data with `Content-Type: application/json` correctly
- [x] Parses POST data with `Content-Type: application/x-www-form-urlencoded` correctly
- [ ] Support for Cross-Origin-Resource-Sharing (CORS)
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
  enableCookieParsing: true,
  enableJsonBody: true,
  enableUrlEncodedBody: true,
  jsonBodyLimit: '100kb',
  jsonBodyType: '*/json',
  urlEncodedLimit: '100kb',
  urlEncodedType: '*/x-www-form-urlencoded',
});
const instance = server.listen(() => {
  const {port} = instance.address;
  console.info(`Listening on http://localhost:${port}`)
});
```

## API Documentaiton

### `.createServer(:options)`
Returns a bootstrapped Express server. The `:options` parameter has the following schema:

| Key | Defaults To | Description |
| --- | --- | --- |
| `enableCookieParsing` | `true` | Enables use of `.cookies` in the request object in Express handlers |
| `enableJsonBody` | `true` | Enables use of `.body` in the request object if the `Content-Type` matches the `:jsonBodyType` parameter |
| `enableUrlEncodedBody` | `true` | Enables use of `.body` in the request object if the `Content-Type` matches the `:urlEncodedType` parameter |
| `jsonBodyLimit` | `"100kb"` | Maximum size of the POST data to parse |
| `jsonBodyType` | `"*/json"` | Indicates the `Content-Type` pattern when the body should be parsed by the JSON parser |
| `urlEncodedLimit` | `"100kb"` | Maximum size of the POST data to parse |
| `urlEncodedType` | `"*/x-www-form-urlencoded"` | Indicates the `Content-Type` pattern when the body should be parsed by the URL Encoded parser |

## Examples

`WIP`

## Development

`WIP`

## License

This package is licensed under the MIT license.

View the license at [LICENSE](./LICENSE).

## Changelog

### 0.1.0
- Initial release

## Contributors

| Name | Email | Website | About Me |
| --- | --- | --- | --- |
| Joseph | - | https://github.com/zephinzer | - |

# Cheers
