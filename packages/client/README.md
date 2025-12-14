# Client Package (@rsd/client)

## Overview

The RSD client is a modern React application built for the MCESC vision and hearing services documentation system. It provides a responsive, accessible interface for managing student services, notes, and documentation with offline capabilities through Progressive Web App (PWA) features.

## Technology Stack

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TinyMCE
- **Theming**: next-themes for dark/light mode
- **PWA**: Vite PWA plugin with Workbox

## shadcn/ui Integration

This project uses [shadcn/ui](https://ui.shadcn.com/) as its component system, providing a comprehensive set of accessible, customizable UI components built on top of Radix UI primitives.

### Configuration

The shadcn/ui setup is configured in [`components.json`](./components.json):

### Available UI Components

The project includes the following shadcn/ui components in [`src/components/ui/`](./src/components/ui/):

### Theming System

The application supports both light and dark themes using `next-themes`:

## Project Structure

```text
src/
├── components/         # Reusable UI components
│   └── ui/             # shadcn/ui components
├── views/              # Page components
├── layout/             # Layout components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── providers/          # Context providers
├── contexts/           # React contexts
├── lib/                # Utility libraries
└── assets/             # Static assets
```

## Development Workflow

### Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm start
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

### Adding New shadcn/ui Components

To add new shadcn/ui components to the project:

```bash
npx shadcn@latest add [component-name]
```

This will automatically:

- Download the component to `src/components/ui/`
- Update imports and dependencies
- Maintain consistent styling and configuration

After the component is added, run lint:fix to update code formatting

## Key Features

### Progressive Web App (PWA)

The application is configured as a PWA with:

- **Offline Support**: Critical app functionality available offline
- **Service Worker**: Automatic caching and background sync
- **App Installation**: Can be installed on devices
- **Push Notifications**: System notifications support

### Rich Text Editing

- **TinyMCE Integration**: Full-featured rich text editor
- **Custom Configuration**: Tailored for documentation needs
- **Accessibility**: Screen reader compatible
- **Auto-save**: Prevents data loss

### Form Management

- **React Hook Form**: Performance-optimized form handling
- **Zod Validation**: Type-safe form validation
- **Error Handling**: User-friendly error messages
- **Auto-completion**: Enhanced user experience

### Data Management

- **TanStack Query**: Server state management with caching
- **Optimistic Updates**: Immediate UI feedback
- **Background Refetching**: Keeps data fresh
- **Offline Queue**: Queues mutations when offline

### Accessibility

- **WCAG Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Logical tab order
