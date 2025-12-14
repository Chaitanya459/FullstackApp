# Vision Hearing Migration

This package contains the migration script to import Excel data from the vision and hearing departments into the PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file and configure your database settings:
```bash
cp .env.example .env
```

3. Edit `.env` with your database configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rsd
DB_USER=postgres
DB_PASSWORD=your_password
```

## Usage

Run the migration:
```bash
npm run migrate
```

## Data Files

The migration expects the following Excel files in the `data/` directory:

- `Vision & Hearing Service Districts.xlsx` - District information
- `STAFF Hearing & Vision 2025  ddr.xlsx` - Therapist information
- `VISION 24-25 DISTRICTS ddr.xlsx` - Vision therapist district assignments
- `HEARING 24-25 DISTRICTS ddr .xlsx` - Hearing therapist district assignments
- `Active PS Student List by Grade.xlsx` - Active student information
- `Hearing Case Loads.xlsx` - Hearing case load data
- `Vision Department Case Loads.xlsx` - Vision case load data
- `Hearing - Student Services Documentation (Responses).xlsx` - Hearing service documentation
- `VI - Student Services Documentation (Responses).xlsx` - Vision service documentation

## Database Schema

The migration assumes the following database schema exists:

- `organization.districts` - School districts
- `organization.buildings` - School buildings
- `people.students` - Student records
- `identity.users` - User/therapist records
- `services.therapist_districts` - Therapist-district assignments
- `services.student_enrollments` - Student enrollment records
- `services.documentation` - Service documentation records

## Migration Process

The migration runs in the following order:

1. Districts - Creates district records
2. Therapists - Creates user records for therapists
3. Therapist Districts - Creates therapist-district assignments
4. Active Students - Creates student and enrollment records
5. Case Loads - Processes case load assignments
6. Services Documentation - Imports service records and documentation

## Notes

- The migration uses upsert logic to avoid duplicate records
- Therapist users are created with generated email addresses if not provided
- Date parsing handles both Excel serial numbers and date strings
- The migration is idempotent and can be run multiple times safely
