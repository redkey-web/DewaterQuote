# deWater Products - Industrial Pipe Fittings Website

## Overview
deWater Products is a B2B e-commerce website for industrial pipe fittings, valves, couplings, expansion joints, and strainers, serving the Australian market. Its primary purpose is to function as a product catalog and a quote request platform for professional industrial buyers. The site emphasizes access to technical specifications, SKUs, and pricing for plumbing and pipe fitting components from brands like Straub, Orbit, and Teekay, operating on a quote-based purchasing model instead of direct e-commerce checkout. The project aims to provide comprehensive product details, transparent pricing, and an efficient request-for-quote process.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The design adheres to Material Design principles adapted for industrial B2B contexts, utilizing the "new-york" style variant within `shadcn/ui`. The color scheme is based on the deWater Products logo, featuring a primary cyan (`#39C2D9`) and an accent orange, both designed to meet WCAG AA compliance for accessibility. Typography uses Inter for general text and JetBrains Mono for technical data. The site supports both light and dark modes.

**Hero Section Industrial Buttons**: Hero CTA buttons feature custom industrial metallic styling inspired by pipe coupling hardware, with brushed metal gradients (HSL-based), bold 3px dark borders, and four decorative blue bolt elements positioned at corners. Primary button uses cyan-tinted metallic finish (hsl(189, 15-24%, 28-40%)) with prominent glow, while secondary button uses darker pure grayscale (hsl(0, 0%, 24-35%)) with subtle glow. Both meet WCAG AA contrast standards (≥5:1 primary, ≥6:1 secondary) and maintain clear visual hierarchy. Hover effects brighten the metallic finish and intensify blue bolt glow without transform animations.

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite.
- **Routing**: Wouter for lightweight client-side navigation.
- **UI Components**: Radix UI primitives styled with `shadcn/ui`.
- **Styling**: Tailwind CSS with custom CSS variables for theming.
- **State Management**: @tanstack/react-query for server state; `useState` for local component state, including a quote cart persisted in `localStorage`.
- **Form Handling**: React Hook Form with Zod for validation.
- **Key Features**: Product catalog with filtering, a comprehensive quote cart system, responsive design, and an interactive product finder.

### Backend Architecture
- **Framework**: Express.js on Node.js with TypeScript.
- **API Pattern**: RESTful API design.
- **Development Server**: Vite integration for HMR and serving both client and API.
- **Storage Interface**: Abstracted `IStorage` interface, currently with an in-memory implementation (`MemStorage`), designed for future database integration.

### System Design Choices
The application is a modern, performant Single Page Application (SPA). A key decision is the quote-based purchasing workflow, catering to B2B industrial procurement. The architecture allows for scalability and maintainability through modular components, type-safe development, and an abstracted storage layer.

### Feature Specifications
- **Product Catalog**: Displays over 25 industrial pipe fittings, valves, couplings, expansion joints, and strainers with real product data, SKUs, technical specifications, and professional photography. Products are categorized by type and brand. All valve products now feature professional industrial photography imported from stock image library.
- **Product Pricing**: Products can have static prices, variable pricing based on size/variation (displayed in a detailed table), or "Price on Application" (POA). Prices are shown excluding GST.
- **Enhanced Product Detail Pages**: Comprehensive product pages with:
  - **Image Gallery**: Multi-image gallery with clickable thumbnails for product photography (4+ images)
  - **Multi-Variation Selector**: ScrollArea-based interface (320px height) displaying all size variations with inline +/- quantity controls, allowing users to select quantities for multiple sizes simultaneously in a single "Add to Quote" action. Each variation row shows size label, SKU, and price with real-time quantity tracking.
  - **Smart Add to Quote**: Button displays total item count badge, is disabled when no selections made, and shows helpful guidance text. Upon adding, all selected variations are added to the cart with their respective quantities, and the selector resets to zero.
  - **Tabbed Content**: Organized tabs for Description, Technical Specifications, and Product Video
  - **Video Embed**: YouTube video demonstrations embedded in dedicated Video tab
  - **Datasheet Download**: PDF technical datasheets with download button
  - **Reference Implementation**: Flex Grip L product serves as complete working example with 48 size variations ($336-$944), 4 images, video, and datasheet
- **Request for Quote (RFQ) System**: A comprehensive form allows users to submit quote requests for items in their quote cart. The cart persists across sessions using `localStorage`. Quote items include complete size/SKU/price variation details for accurate procurement.
- **Navigation**: Consistent URL structure across header, homepage, and footer, with dynamic product filtering based on categories and subcategories.
- **Industry Solutions**: Visual card-based layout featuring professional photography for each industry sector (Construction, Fire Services, Food & Beverage, HVAC, Irrigation, Marine, Mining, Water & Wastewater).
- **Homepage Categories**: Displays 4 main product categories in a balanced grid layout with teal accent color for "View all" links.
- **How It Works Section**: Educational 3-step process section on homepage explaining the quote-based purchasing workflow: (1) Browse & Select products, (2) Submit quote request with details, (3) Receive final quote with trade discounts and lead times via email. Features circular icon backgrounds with Search, ClipboardList, and Mail icons, plus staggered typewriter effects on descriptions.
- **Neto API Integration**: Real-time product data, pricing, and variations fetched from Neto/Maropost ecommerce platform (dewaterproducts.com.au).

## External Dependencies

### UI/Styling
- **Radix UI**: Unstyled, accessible React components.
- **shadcn/ui**: Component patterns and styling.
- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority**: Component variant styling.
- **Google Fonts**: Inter, JetBrains Mono.
- **Lucide React**: Icon library.

### Data & State Management
- **@tanstack/react-query**: Server state management.
- **React Hook Form**: Form state and validation.
- **Zod**: Schema validation.

### Database & ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL.
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **Neon Database**: Hosted PostgreSQL.

### Development & Build Tools
- **Vite**: Frontend build tool and dev server.
- **TypeScript**: Language for frontend and backend.
- **ESBuild**: Backend bundling for production.

### Routing
- **Wouter**: Lightweight client-side router.

### Other Libraries
- **Framer Motion**: Animation library.
- **embla-carousel-react**: Carousel component.
- **date-fns**: Date manipulation.
- **cmdk**: Command menu component.
- **nanoid**: Unique ID generation.
- **connect-pg-simple**: PostgreSQL session store for Express (planned for use).