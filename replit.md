# deWater Products - Industrial Pipe Fittings Website

## Overview

deWater Products is a B2B e-commerce website for industrial pipe fittings, valves, couplings, expansion joints, and strainers. The site serves as a product catalog and quote request platform for industrial customers in Australia. It features product browsing by category and brand, with a quote-based purchasing workflow rather than traditional e-commerce cart checkout.

The application is designed for professional industrial buyers who need quick access to technical specifications, SKU information, and pricing for plumbing and pipe fitting components from brands like Straub, Orbit, and Teekay.

## Recent Changes (November 2025)

### Product Catalog Integration
- **Expanded catalog**: Increased from 4 to 15 real products with comprehensive technical details
  - Valves (5 products): Butterfly Valve, Duckbill Check Valve, Foot Valve, Ball Valve, Gate Valve
  - Pipe Couplings (6 products): Orbit Standard Coupling, Flex Grip L, Flex Grip S, Metal Lock L, Metal Lock S, Fire Protection Coupling
  - Pipe Repair Clamps (1 product): Orbit Pipe Repair Clamp
  - Strainers (1 product): Y-Strainer
  - Rubber Expansion Joints (1 product): Rubber Expansion Joint
- **Real product data**: All products sourced from live dewaterproducts.com.au site with authentic SKUs, specifications, and features
- **Centralized data model**: All products sourced from `shared/data/catalog.ts` with proper TypeScript types
- **Category pages updated**: ValvesPage, ClampsCouplingsPage, StrainersPage, and ExpansionJointsPage now display real catalog products
- **Product filtering**: ProductListPage filters products by subcategory using catalog helper functions
- **Routing alignment**: Fixed subcategory navigation to match App.tsx route definitions
- **Key product additions** (November 2025):
  - Flex Grip L (OCFG-L): Long model flexible coupling for axial movement and vibration
  - Flex Grip S (OCFG-S): Short model compact flexible coupling
  - Metal Lock L (OCML-L): Long model with axial restraint and pull-out resistance
  - Metal Lock S (OCML-S): Short model with axial restraint
  - Fire Protection Coupling (OCFPC): IACS compliant for fire protection systems

### Request for Quote (RFQ) System
- **Complete RFQ form**: Built comprehensive quote request form at `/request-quote`
  - Form fields: Name, Email, Phone, Company (optional), Message (optional)
  - Validation using react-hook-form with Zod schemas
  - Displays all quote items with ability to remove individual items
  - Success confirmation page after submission
  - Quote cart automatically cleared after successful submission
- **Quote cart integration**: Connected RFQ form to existing quote cart state in App.tsx
- **SPA navigation**: Updated to use Wouter's `navigate()` instead of `window.location` for consistent routing

### Navigation System Fixes (November 2025)
- **Complete URL structure alignment**: Fixed all navigation components to use NEW URL structure consistently
  - Header dropdown menu: Updated all category and subcategory URLs
  - Made category titles clickable in Header dropdown navigation
  - HomePage category cards: Changed URLs from old structure (/clamps-couplings, /expansion-joints) to new (/pipe-couplings, /rubber-expansion-joints)
  - Footer product links: Updated to match new URL patterns
- **ProductListPage critical fix**: Corrected product filtering logic
  - Now properly determines category from matched route
  - Passes BOTH category and subcategory parameters to getProductsBySubcategory()
  - Maps URL subcategory keys to catalog subcategory identifiers
  - Fixed issue where /pipe-couplings/pipe-couplings showed "No products available"
- **Architect review**: PASS - All navigation components aligned with revised slug structure, product filtering restored

### UI Improvements (November 2025)
- **Removed prominent announcement banner**: Eliminated the yellow (#FBB13C) scrolling banner at the top of the page
- **Added subtle delivery message**: Replaced with understated "Free delivery to metro areas" text in header
  - Features small truck icon from Lucide React
  - Uses muted text color and small font size for subtlety
  - Responsive: shows full message on xl screens, abbreviated on lg screens
  - Positioned in header's contact area, less visually prominent than previous banner
- **Updated colour scheme to match logo with WCAG AA compliance** (November 2025):
  - Primary colour based on logo cyan (#48c5db) but darkened for accessibility
  - Light mode primary: 187 85% 25% (achieves 6.4:1 contrast with white text)
  - Dark mode primary: 187 75% 28% (achieves 5.8:1 contrast with white text)
  - Accent orange: 25 95% 35% light mode, 25 90% 38% dark mode (both >4.5:1 contrast)
  - All action buttons and interactive elements meet WCAG AA standards
  - Logo cyan (#48c5db at 57% lightness) reserved for borders, accents, and highlights where contrast isn't critical
  - Neutral grays based on logo gray (#5e5e5e)
  - Subtle cyan glow on hover states with darker base for visibility

### Testing & Verification
- **E2E tests passed**: Complete user journey tested successfully
  - Browse products by category (homepage cards and header dropdown)
  - Navigate to category pages (/pipe-couplings, /valves, etc.)
  - Navigate to subcategory pages (/pipe-couplings/pipe-couplings, /valves/gate-valves)
  - View product details with certifications
  - Add products to quote cart
  - Submit quote requests through RFQ form
  - Receive confirmation after submission
  - All navigation links working without 404 errors

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