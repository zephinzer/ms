import v1 from './v1';

function users(version) {
  return users[version]();
}

users.versions = () =>
  Object.keys(users).filter((v) => v.match(/^v[0-9\.]+$/));

users.v1 = v1;

export default users;
