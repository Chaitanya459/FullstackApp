---
applyTo: '**/**/*.{cs,ts,tsx,js,jsx,json,config,md}
---
# RSD Project - AI Assistant Guidelines

## Project Overview
This is an ExpressJS Typescript project with React frontend implementing a Related Services Documentation (RSD) system for therapists to track billing of student services. The project follows Clean Architecture principles with clear separation between Domain, Application, Infrastructure, and API layers.

## Architecture Patterns
- **Backend**: Clean Architecture with CQRS pattern, Typescript, SequelizeTS, and ExpressJS
- **Frontend**: React with TypeScript, using modern hooks and functional components
- **Database**: PostgreSQL with Liquibase migrations
- **Testing**: Jest + React Testing Library for frontend, Jest + Supertest for backend
- **Dependency Injection**: InversifyJS for managing dependencies
- **Object Mapping**: Morphism for mapping incoming/outgoing data from controllers
- **Validation**: zod for schema validation
- **UI Components**: ShadCN UI library for consistent design

## Coding Standards

### TypeScript/Node.js Standards
- Use modern TypeScript features and syntax
- Follow Clean Architecture principles with proper layer separation
- Use dependency injection for all external dependencies
- Implement CQRS pattern with separate commands and queries
- Use async/await for all I/O operations
- Follow SOLID principles and design patterns
- Use Inversify for object mapping between layers
- Implement proper validation using zod

### TypeScript/React Standards
- Use functional components with hooks (no class components)
- Use TypeScript for type safety - avoid `any` type
- Use `React.FC<Props>` for component typing
- Follow established patterns in `src/contexts/` for state management
- Use the established service patterns in `src/services/` for API calls
- Implement proper error boundaries and loading states
- Use semantic HTML and ensure accessibility
- Prefer ShadCN UI components for UI consistency

### Naming Conventions
- **TypeScript**: camelCase for variables/functions, PascalCase for components/interfaces
- **React**: camelCase for hooks and functions, PascalCase for components
- **DTOs**: PascalCase with "DTO" suffix (e.g., CreateStudentDTO). File name matches DTO name without suffix (e.g., CreateStudent.ts)
- **Files**: kebab-case for file names, PascalCase for component files
- **Database**: snake_case for table and column names

### Shared Types and Mapping
- Use shared types in `packages/types/` for DTOs
- Use Morphism for mapping between DTOs and domain entities
- Follow established mapping patterns in `packages/backend/src/modules/**/mappers`
- Store domain entities in `packages/backend/src/types`

## Domain Knowledge

### Core Entities
- **Students**: Students receiving services. Assigned to therapists and linked to school districts.
- **Therapists**: Service providers assigned to students. Therapists are users in the system.
- **Users**: System users with role-based permissions
- **Documentation**: Records of services provided to students
- **School Districts**: Educational districts overseeing students and therapists
- **Referrals**: Requests for services made for students by district representatives (users with specific roles)

### Business Rules
- Users must have appropriate roles to access certain resources

## Development Guidelines

### Starting the Project

- To start the backend server, run `npm run dev` in the `packages/backend` directory
- To start the frontend server, run `npm start` in the `packages/frontend` directory

### Code Quality
- Write self-documenting code with clear naming
- Use JSDoc comments for complex TypeScript functions
- Remove debug statements (console.log) before committing
- Follow established error handling patterns

### Testing Requirements
- Write unit tests for business logic
- Test both happy path and edge cases
- Use mocking for external dependencies
- Maintain good test coverage for critical functionality
- Follow AAA pattern (Arrange, Act, Assert)

### Security Considerations
- Never expose sensitive data in logs or error messages
- Use proper authentication and authorization
- Validate all inputs on both client and server
- Follow established security patterns in the codebase

### Performance
- Use async/await for I/O operations
- Implement proper caching strategies
- Use pagination for large data sets
- Optimize database queries
- Use React.memo() and useMemo() for expensive operations

## File Organization
- Follow the established folder structure
- Group related functionality together
- Use feature-based organization within layers
- Keep components focused and single-responsibility
- Use barrel exports (index files) for clean imports

## API Integration
- Use established DTO patterns for data transfer
- Follow RESTful conventions
- Implement proper error handling and status codes
- Use the existing service layer patterns
- Handle authentication tokens properly

## Database Patterns
- Use Liquibase migrations for schema changes (see `database/changelogs.yaml`)
- Follow established naming conventions
- Implement proper relationships and constraints
- Use repository pattern for data access
- Implement soft delete where appropriate

## When Generating Code
- Always consider the existing patterns in the codebase
- Follow the established architecture and conventions
- Ensure proper error handling and validation
- Include appropriate tests for new functionality
- Consider security implications of any changes
- Use the existing dependency injection patterns
- Follow the established file organization structure
