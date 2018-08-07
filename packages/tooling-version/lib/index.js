#!/usr/bin/env node
const {spawn} = require('child_process');
const semver = require('semver');
const commander = require('commander');

commander
  .name('version')
  .option('-c, --current', 'returns the next version')
  .option('-p, --patch', 'returns the next patch version')
  .option('-m, --minor', 'returns the next minor version')
  .option('-M, --major', 'returns the next major version')
  .option('-i, --init', 'initializes current repository at version 0.0.0')
  .option('-q, --quiet', 'return just the semantic version')
  .option('-x, --execute', 'run the git tag command')
  .parse(process.argv);


(new Promise((resolve, reject) => {
  let error = '';
  const checkIfGitRepo = spawn('git', ['status']);
  checkIfGitRepo.stderr.on('data', (dataChunk) => error += dataChunk);
  checkIfGitRepo.on('exit', (exitCode) => {
    if (exitCode === 0) {
      resolve();
    } else {
      reject({
        exitCode,
        error,
      });
    }
  });
})).then(() => new Promise((resolve, reject) => {
  let gitTags = '';
  let error = '';
  const git = spawn('git', ['tag', '--list']);
  git.stdout.on('data', (dataChunk) => gitTags += dataChunk);
  git.stderr.on('data', (dataChunk) => error += dataChunk);
  git.on('exit', (exitCode) => {
    if (exitCode === 0) {
      resolve(gitTags.split('\n'));
    } else {
      reject({
        exitCode,
        error,
      });
    }
  });
})).catch((ex) => {
  (!commander.quiet) &&
    console.error(`Git exited with status code ${ex.exitCode}`);
  (!commander.quiet) && console.error(ex.error);
  process.exit(0 - ex.exitCode);
}).then((listOfGitTags) => {
  let modified = false;
  let latest = '0.0.0';
  listOfGitTags.forEach((tag) => {
    if (tag) {
      latest = (semver.valid(tag) && semver.gt(tag, latest)) ? tag : latest;
      modified = true;
    }
  });
  return modified ? latest : null;
}).then((latestTag) => {
  let nextTag = latestTag;
  if (latestTag !== null) {
    if (commander.major) {
      (!commander.quiet) && process.stdout.write('Next major version: ');
      nextTag = semver.inc(latestTag, 'major');
      console.info(nextTag);
    } else if (commander.minor) {
      (!commander.quiet) && process.stdout.write('Next minor version: ');
      nextTag = semver.inc(latestTag, 'minor');
      console.info(nextTag);
    } else if (commander.patch) {
      (!commander.quiet) && process.stdout.write('Next patch version: ');
      nextTag = semver.inc(latestTag, 'patch');
      console.info(nextTag);
    } else {
      (!commander.quiet) && process.stdout.write('Current version: ');
      console.info(latestTag);
    }

    if (commander.execute && (nextTag !== latestTag)) {
      (!commander.quiet) &&
        process.stdout.write(`Upgrading ${latestTag} -> ${nextTag}... `);
      return (new Promise((resolve, reject) => {
        const gitTagInit = spawn('git', ['tag', nextTag]);
        gitTagInit.on('exit', (exitCode) => {
          if (exitCode === 0) {
            resolve('version bump');
          } else {
            reject('version bump');
          }
        });
      }));
    }
  } else if (commander.init) {
    (!commander.quiet) &&
      process.stdout.write('Initializing repository versioning at 0.0.0... ');
    return (new Promise((resolve, reject) => {
      const gitTagInit = spawn('git', ['tag', '0.0.0']);
      gitTagInit.on('exit', (exitCode) => {
        if (exitCode === 0) {
          resolve('init');
        } else {
          reject('init');
        }
      });
    }));
  } else {
    (!commander.quiet) &&
      process.stderr.out('ERR > Repository has not been initialized. use the -i flag to initialize it.\n'); // eslint-disable-line max-len
    process.exit(1);
  }
}).then((resolvedType) => {
  if (resolvedType !== undefined) {
    (!commander.quiet) && process.stdout.write(`DONE (${resolvedType})\n`);
  }
  process.exit(0);
}).catch((resolvedType) => {
  if (resolvedType !== undefined) {
    (!commander.quiet) && process.stderr.write(`FAILED (${resolvedType})\n`);
  }
  process.exit(1);
});
