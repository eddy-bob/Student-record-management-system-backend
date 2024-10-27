## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Migrations

### Generating Migrations

Migrations are not manually written, instead we leverage typeorm's migration generator which checks the state of our database and generates a migration file to cover all changes made to the entities within the source code.

```
$ yarn typeorm migration:generate ./src/database/migrations/<NameOfMigration>
```

### Running Migrations

To run migrations simply run

```
$ yarn migration:run
```
