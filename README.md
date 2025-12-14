# Related Services Documentation (RSD)

## Contents

- [Related Services Documentation (RSD)](#related-services-documentation-rsd)
  - [Contents](#contents)
  - [Monorepo Overview](#monorepo-overview)
    - [Packages Overview](#packages-overview)
  - [Installation](#installation)
  - [Development](#development)

## Monorepo Overview

The RSD project is organized as a [lerna](https://github.com/lerna/lerna#readme)-managed monorepo containing multiple related packages for managing vision and hearing services documentation at MCESC.

### Packages Overview

The monorepo consists of the following main packages:

- [**`@rsd/backend`**](./packages/backend/README.md) - The main API application built with Express.js and TypeScript
- [**`@rsd/client`**](./packages/client/README.md) - React frontend application with shadcn/ui components
- [**`@rsd/database`**](./packages/database/README.md) - Liquibase database management and migrations
- [**`@types/rsd`**](./packages/types/README.md) - Shared TypeScript type definitions
- [**`@rsd/vision-hearing-migration`**](./packages/visionHearingMigration/README.md) - Data migration utilities for legacy Excel data

## Installation

1. Clone repository

   ```bash
   git clone git@git.uc.edu:MCESC/RSD.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create your config files at [packages/backend/config/](packages/backend/config/)
   - Use 1Password and enable 1Password CLI in the desktop app under `Settings > Developer > Connect with 1Password CLI`
   - Ensure that 1Password CLI is installed on your computer `op --version`
   - After this run `git pull` or `npm run reveal-secrets` to write your secret files

4. Start the API in development mode
   - `cd packages/backend`
   - `npm run start:dev`

5. In another terminal, start the client in development mode
   - `cd packages/client`
   - `npm start`

## Development

The project uses a monorepo structure with shared scripts:

- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages
- `npm run lint` - Lint all packages
- `npm run lint:fix` - Fix linting issues
