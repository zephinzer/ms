# `@usvc/tooling-version`
CLI version manipulation toolkit using Git tags for versioning.

## Scope

- [x] Initialize a repository at 0.0.0
- [x] Retrieve current semver version
- [x] Retrieve next semver patch version upgrade
- [x] Retrieve next semver minor version upgrade
- [x] Retrieve next semver major version upgrade
- [x] Add Git tag for next semver major version upgrade
- [x] Add Git tag for next semver minor version upgrade
- [x] Add Git tag for next semver patch version upgrade
- [x] Silent mode for CI usage

## Installation

```bash
npm i -g @usvc/tooling-version;
```

## Usage

```bash
usvct-version -h; # help
usvct-version -c; # gets current semver versioning
usvct-version -p; # gets next patch version
usvct-version -m; # gets next minor version
usvct-version -M; # gets next major version
usvct-version -i; # initializes git repository version at 0.0.0
usvct-version -x; # adds generated git tags to the repository
usvct-version -q; # silences all output other than the version
```

The options `-i`, `-x` and `-q` can be combined with the version bump type indicator flags.

For example, to retrieve the next patch version, you would run `usvct-version-repo -p`.

To retrieve just the version without any additional output, you could run `usvct-version-repo -pq`.

Should you wish to immediately tag the current commit as well, you could run `usvct-version-repo -pqx`.

# Cheers