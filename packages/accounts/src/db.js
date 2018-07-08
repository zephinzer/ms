import fs from 'fs';
import path from 'path';
import knex from 'knex';
import config from './config';
import knexConfig from '../knexfile';

const db = knex(knexConfig);
function dbExport() {
  return db(config.get('databaseSchema'));
}

dbExport.isAtLatest = async () => {
  // holds the migrations recorded in `knex_migrations`
  let migrationsInDatabase;
  try {
    migrationsInDatabase = (
      await db(config.get('databaseSchema'))
        .select('*').from(knexConfig.migrations.tableName)
      ).map((migrationInDatabase) => migrationInDatabase.name);
  } catch (ex) {
    return {
      error: ex,
    };
  }

  // holds the migrations listed in the migrations directory
  let latestMigrationDefinitions;
  try {
    latestMigrationDefinitions =
      fs.readdirSync(path.join(__dirname, '../', knexConfig.migrations.directory));
  } catch (ex) {
    return {
      error: ex,
    };
  }

  // utility function to make things more readable
  const found = ((indexOf) => (indexOf !== -1));

  let pendingMigrations = [];
  // evaluate if all migrations in migrations directory are also found in the database
  return latestMigrationDefinitions.reduce(
    (_isAtLatest, migrationIdThatShouldBeThere) => {
      const migrationFound = (found(migrationsInDatabase.indexOf(migrationIdThatShouldBeThere)));
      (!migrationFound) && pendingMigrations.push(migrationIdThatShouldBeThere);
      return _isAtLatest && migrationFound;
    },
    true
  ) ? true 
    : {
      error: 'migrations pending',
      data: pendingMigrations,
    };
};

export default dbExport;
