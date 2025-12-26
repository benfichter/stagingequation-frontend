# Visual Staging AI

## Overview

Visual Staging AI is a web application that transforms room images using AI-powered visual staging with dimension-calibrated furniture placement. The application guides users through a 4-step workflow: Upload → Configure → Calibrate → Results. Users upload room images, configure room parameters (type, ceiling height, style preferences), view AI-calibrated room dimensions, and receive professionally staged results with optional furniture dimension overlays.

The application uses a modern tech stack with React and TypeScript on the frontend, Express.js on the backend, and is designed with a clean, professional Material Design-inspired interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight React Router alternative)

**UI Component System:**
- shadcn/ui component library (New York style variant) providing accessible, customizable components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming support (light/dark mode infrastructure)
- Inter font family (weights 400-700) via Google Fonts CDN

**State Management:**
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod resolvers for form validation
- Local component state using React hooks for UI interactions

**Design System:**
- Material Design approach with references to professional AI tools (Midjourney, Runway ML, Adobe Firefly)
- Custom spacing system using Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Maximum content width of 1152px (max-w-6xl)
- Responsive grid layouts with mobile-first breakpoints

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe server code
- Custom middleware for request logging and JSON body parsing with raw body preservation
- Modular route registration system (currently minimal implementation)

**Development Environment:**
- Hot module replacement via Vite middleware in development
- Custom error overlay plugin for runtime errors (@replit/vite-plugin-runtime-error-modal)
- Replit-specific development tools (cartographer, dev banner) for enhanced DX

**Build Process:**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` with ESM format
- Separate TypeScript compilation check (`npm run check`)

### Data Storage

**ORM & Database:**
- Drizzle ORM configured for PostgreSQL with type-safe query building
- Schema-first approach with migrations in `./migrations` directory
- Drizzle-Zod integration for runtime validation matching database schema
- Neon Database serverless driver (@neondatabase/serverless) for PostgreSQL connections

**Schema Design:**
- Users table with UUID primary keys, username/password fields
- Room configuration validation schema defining:
  - Room types (bedroom, living-room, dining-room, kitchen, office, bathroom)
  - Ceiling height measurements (6-20 units with ft/m options)
  - Design styles (modern, minimalist, industrial, scandinavian, traditional, bohemian)

**Storage Pattern:**
- In-memory storage implementation (MemStorage) for development/testing
- IStorage interface defining CRUD operations for users
- Designed for easy swap to database-backed storage in production

### Application Workflow

**4-Step Process:**
1. **Upload**: Drag-and-drop or click-to-upload interface for room images
2. **Configure**: Form-based configuration for room type, ceiling height, and design style
3. **Calibrate**: Canvas-based visualization showing AI-detected room dimensions with measurement overlays
4. **Results**: Display of staged room with toggle for furniture dimension overlays and download functionality

**Canvas Rendering:**
- HTML5 Canvas API for drawing dimension lines and measurements on room images
- Separate canvases for room calibration (blue lines) and furniture dimensions (green lines)
- Client-side image processing for measurement visualization

### Path Aliases & Module Resolution

**TypeScript Path Mapping:**
- `@/*` → `./client/src/*` (frontend components, pages, utilities)
- `@shared/*` → `./shared/*` (shared types and schemas)
- `@assets/*` → `./attached_assets/*` (static assets)

**Bundler Configuration:**
- Vite resolver configured to match TypeScript paths
- ESM module resolution with `allowImportingTsExtensions` enabled

## External Dependencies

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled primitives (accordion, dialog, dropdown, select, slider, etc.)
- **shadcn/ui**: Pre-styled component system built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command menu component for keyboard-driven navigation
- **embla-carousel-react**: Carousel/slider functionality
- **vaul**: Drawer component library

### Form & Validation
- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form
- **drizzle-zod**: Automatic Zod schema generation from Drizzle tables

### State Management & Data Fetching
- **TanStack Query**: Async state management with caching, background updates, and optimistic UI patterns
- **date-fns**: Date manipulation and formatting utilities

### Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe component variant management
- **clsx**: Conditional className composition
- **tailwind-merge**: Intelligent Tailwind class merging to prevent conflicts

### Database & Backend
- **Neon Database Serverless**: PostgreSQL-compatible serverless database driver
- **Drizzle ORM**: Type-safe SQL query builder with migration support
- **drizzle-kit**: CLI tools for schema management and migrations
- **connect-pg-simple**: PostgreSQL session store (for future session management)

### Development Tools
- **Vite**: Next-generation frontend build tool with native ESM
- **esbuild**: Ultra-fast JavaScript bundler for server code
- **tsx**: TypeScript execute for development server
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code mapping tools (Replit-specific)
- **@replit/vite-plugin-dev-banner**: Development environment banner

### Build Configuration
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins
- **Autoprefixer**: Automatic vendor prefix addition for CSS