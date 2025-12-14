# Liquibase for DB Management

## How to add new changesets

### SQL

In the appropriate version file, add a new changeset with the following format:

```sql
-- changeset <author>:<changeset-id> labels:v<version-number>
-- comment: <description of the changeset including issue number>
<SQL statement>
-- rollback <rollback statement; optional>
```

where changeset-id is a unique identifier for the changeset. It can be any string, but we'll agree to the following convention: `<YYYY>-<MM>-<DD>-<increment>`

#### Example

```sql
-- changeset reedws:2023-05-01-1 labels:v1.0.0
-- comment: Issue #1 - made these changes to this
<SQL statement>
-- rollback <rollback statement; optional>
```

## Usage

### To get the current status of the database

```bash
npm run database --env=<env> status
```

### To update the database

```bash
npm run database --env=<env> update
```

### To generate a diff changelog between two databases

```bash
npm run database --from=<reference-env> --to=<target-env> diff-changelog -- --changelog-file=changelog.sql --schemas=flowcharts,forms,schools,users
```

### To get initial load of data (ONLY DO THIS TO SET UP THE PROJECT)

This will create a changelog of the current database state. This should only be done once to set up the project.

```bash
npm run database --env=<env> generate-changelog -- --changelog-file=changelog.sql --schemas=flowcharts,forms,schools,users
```

This will tell liquibase that all changelogs have been applied without making any changes. This should only be done once to set up the project after creating the initial changelog

```bash
npm run database --env=<env> changelog-sync
```
