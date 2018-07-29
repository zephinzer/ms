# Microservices & Stuff
This repository is a mono-repo for components, libraries, frameworks and other things (like Docker images) that can be used in applications to quickly bootstrap cloud native applications.

Current packages are:

- [`@usvc/logger-application`](./packages/logger-application): application logger for centralised logging
- [`@usvc/logger-request`](./packages/logger-request) : request logging middleware based on Morgan for Express
- [`@usvc/tracer`](./packages/tracer) : distributed tracing middleware that integrates with the request and application logger to provide trace IDs in your logs

## Development
### Getting Started
Clone this repository locally and run `npm install` to install the base dependencies.

Then run `lerna bootstrap` to install dependencies in all the sub-packages.

Next, verify that everything's in working order before starting by running `lerna run lint` and `lerna run test`.

### Directory Conventions
All code in packages should be located in a `./src` directory.

After building, all code should be found in `./dist` directory.

### NPM Script Conventions
All packages should have a `lint`, `test` and `build` for running TSLint, running Mocha, and building the package for publishing.

This allows us to run `lerna run lint` to check the code quality across all packages, `lerna run test` to check the correctness of the code across all packages, and `lerna run built` to create distribution packages for publishing onto NPM.

### Publishing
**Do not publish** code yourself. Let the pipeline handle the publishing so that the tags can be updated accordingly to how Lerna does it. Doing an `npm publish` may result in Lerna causing faults for other contributors because the associated tag cannot be found.

### Development Technologies
All code should be written in Typescript and conform to the configurations at the root of this repository - the [`tsconfig.json`](./tsconfig.json) and the [`tslint.yaml`](./tslint.yaml) files.
