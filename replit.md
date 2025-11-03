# deWater Products - Industrial Pipe Fittings Website

## Overview

deWater Products is a B2B e-commerce website for industrial pipe fittings, valves, couplings, expansion joints, and strainers. The site serves as a product catalog and quote request platform for industrial customers in Australia. It features product browsing by category and brand, with a quote-based purchasing workflow rather than traditional e-commerce cart checkout.

The application is designed for professional industrial buyers who need quick access to technical specifications, SKU information, and pricing for plumbing and pipe fitting components from brands like Straub, Orbit, and Teekay.

## Recent Changes (November 2025)

### Product Catalog Integration
- **Expanded catalog**: Increased from 4 to 10 real products across all major categories
  - Valves: Butterfly Valve, Duckbill Check Valve, Foot Valve, Ball Valve, Gate Valve
  - Pipe Couplings: Orbit Standard Coupling
  - Pipe Repair Clamps: Orbit Pipe Repair Clamp
  - Strainers: Y-Strainer
  - Rubber Expansion Joints: Rubber Expansion Joint
- **Centralized data model**: All products now sourced from `shared/data/catalog.ts` with proper TypeScript types
- **Category pages updated**: ValvesPage, ClampsCouplingsPage, StrainersPage, and ExpansionJointsPage now display real catalog products
- **Product filtering**: ProductListPage filters products by subcategory using catalog helper functions
- **Routing alignment**: Fixed subcategory navigation to match App.tsx route definitions

### Request for Quote (RFQ) System
- **Complete RFQ form**: Built comprehensive quote request form at `/request-quote`
  - Form fields: Name, Email, Phone, Company (optional), Message (optional)
  - Validation using react-hook-form with Zod schemas
  - Displays all quote items with ability to remove individual items
  - Success confirmation page after submission
  - Quote cart automatically cleared after successful submission
- **Quote cart integration**: Connected RFQ form to existing quote cart state in App.tsx
- **SPA navigation**: Updated to use Wouter's `navigate()` instead of `window.location` for consistent routing

### Testing & Verification
- **E2E tests passed**: Complete user journey tested successfully
  - Browse products by category
  - View product details with certifications
  - Add products to quote cart
  - Submit quote requests through RFQ form
  - Receive confirmation after submission

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter (lightweight client-side routing library) handles navigation without full page reloads.

**UI Component System**: Radix UI primitives with shadcn/ui styling patterns. The design follows Material Design principles adapted for industrial B2B contexts, using the "new-york" style variant.

**Styling**: Tailwind CSS with custom CSS variables for theming. The color system supports both light and dark modes with industrial-focused colors (Deep Industrial Blue, Navy Accent, Steel Gray). Typography uses Inter for headings/body and JetBrains Mono for technical data.

**State Management**: React Query (@tanstack/react-query) for server state. Local component state with useState for UI interactions like the quote cart.

**Form Handling**: React Hook Form with Zod schema validation through @hookform/resolvers.

**Key Features**:
- Quote cart system (add products, view cart, submit quote requests)
- Product catalog with filtering by category, brand, and industry
- Responsive design with mobile-first approach
- Interactive product finder matching industries to product categories
- Sticky quote button for easy access to cart

**Rationale**: This stack provides a modern, performant SPA with excellent TypeScript support. Vite offers fast HMR for development. The component library provides accessible, customizable components without building from scratch. React Query simplifies data fetching and caching.

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**API Pattern**: RESTful API design with routes prefixed with `/api`. Currently minimal routes are implemented - the storage interface is prepared but routes need to be registered.

**Development Server**: Custom Vite integration for HMR in development, serving both the React app and API from a single server.

**Storage Interface**: Abstracted storage layer with an `IStorage` interface. Currently using an in-memory implementation (`MemStorage`) for user management. Designed to be swapped with database-backed storage.

**Session Management**: The codebase includes connect-pg-simple for PostgreSQL session storage, suggesting session-based authentication is planned.

**Production Build**: Uses esbuild to bundle the server code, Vite to bundle the client. Static files served from dist/public.

**Rationale**: Express provides a mature, flexible foundation for the API. The storage abstraction allows starting with simple in-memory storage and migrating to a database later without changing application logic. TypeScript across the stack ensures type safety.

### Database Schema

**ORM**: Drizzle ORM configured for PostgreSQL with Neon Database serverless driver.

**Current Schema**: Single `users` table with id (UUID), username (unique text), and password (text). Uses Drizzle-Zod for type-safe schema validation.

**Migration Strategy**: Drizzle Kit manages schema migrations with files output to `./migrations` directory.

**Future Schema Needs**: The application will require tables for products, categories, brands, quotes, quote items, and potentially user sessions. The product catalog structure suggests many-to-many relationships between products and categories/industries.

**Rationale**: Drizzle provides type-safe database queries with excellent TypeScript integration. PostgreSQL offers robust relational data modeling needed for product catalogs. Neon's serverless PostgreSQL is cost-effective for variable workloads.

## External Dependencies

### UI Component Library
- **Radix UI**: Comprehensive set of unstyled, accessible React components (@radix-ui/react-*)
- **shadcn/ui**: Component patterns and styling conventions built on Radix

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant styling
- **Google Fonts**: Inter (headings/body), JetBrains Mono (technical data)

### Data & State Management
- **@tanstack/react-query**: Server state management and caching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation

### Database & ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Neon Database**: Hosted PostgreSQL database (connection via DATABASE_URL environment variable)

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Server-side bundling for production

### Routing & Navigation
- **Wouter**: Lightweight client-side routing

### Animations & UI Enhancement
- **Framer Motion**: Animation library (used in InteractiveProductFinder)
- **embla-carousel-react**: Carousel component
- **Lucide React**: Icon library

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not yet implemented)

### Backend Framework
- **Express**: Web application framework
- **Node.js**: Runtime environment

### Additional Libraries
- **date-fns**: Date manipulation and formatting
- **cmdk**: Command menu component
- **nanoid**: Unique ID generation

### Deployment Platform
- **Replit**: Development and hosting environment (indicated by Replit-specific Vite plugins)