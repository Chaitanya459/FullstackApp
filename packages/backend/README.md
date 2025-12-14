# Backend Package (@rsd/backend)

## Architecture Overview

The RSD backend follows a simplified pattern for data transfer, serving the vision and hearing services documentation system for MCESC. The frontend sends requests directly to the API, which handles all business logic, data validation, and database operations internally. The API is structured as a modular monolith, organized by business domains, eliminating the need for separate microservices while maintaining clear separation of concerns.

The API is organized into several key directories:

- `/src/modules/` - Contains domain-specific modules (user, notes, services, etc.)
- `/src/infra/` - Contains infrastructure concerns (database, HTTP, events, mail service)
- `/src/types/` - Contains shared type definitions
- `/src/utils/` - Contains utility functions (authentication, logging, session management)

### Key Features

- **User Management**: Authentication, authorization, and role-based access control
- **Notes System**: Rich text note creation and management with TinyMCE
- **Service Documentation**: Vision and hearing service tracking and documentation
- **Email Notifications**: Release notifications and system alerts via EJS templates
- **Session Management**: Redis-based session storage
- **Database**: PostgreSQL with Sequelize ORM

### Domain Module Structure

Each module follows a clean architecture pattern with the following structure:

- `/app/` - Contains use cases and controllers for specific operations
- `/infra/` - Contains infrastructure concerns like HTTP routes and database repositories
- `/mappers/` - Contains data transformation logic
- `/services/` - Contains domain services
- `/events/` - Contains domain events (if applicable)

Within each use case in the `/app/` folder, you'll find:

- `controller.ts` - Handles HTTP requests, validates input, and formats responses
- `useCase.ts` - Contains the business logic for the specific operation

### Request Flow Example

An example of how a request is handled by the API would go as follows:

1. The API receives a request on `/api/notes?active=true`
2. The HTTP router (in `/src/infra/http/routes.ts`) routes the request to the appropriate module's HTTP router
3. The module's HTTP router (e.g., `/src/modules/notes/infra/http/noteRouter.ts`) maps the request to the specific controller
4. The controller (e.g., `GetNotesController`) validates and transforms the request parameters using the [`Shield`](src/utils/Shield.ts) middleware for authentication
5. The controller calls the corresponding use case (e.g., `GetNotesUseCase`) with the validated input
6. The use case executes the business logic, often calling repository methods to interact with the database
7. The repository queries the PostgreSQL database and returns the raw data
8. The use case processes the data and returns it to the controller
9. The controller formats the response and sends it back to the client

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Session Storage**: Redis
- **Email**: Nodemailer with EJS templates
- **Dependency Injection**: Inversify
- **Testing**: Jest
- **Validation**: Zod

### Configuration

The application uses JSON configuration files with 1Password integration for secrets management. See [config/](config/) directory for environment-specific configurations.

This architecture provides clear separation of concerns while keeping all related functionality within a single deployable unit, making it ideal for the MCESC vision and hearing services documentation system.
