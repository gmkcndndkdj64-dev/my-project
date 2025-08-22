# Wallet Owners Management System (منظومة إدارة ملاك المحافظ)

## Overview

This is a full-stack web application for managing wallet owners (digital wallet holders) built with a modern tech stack. The system provides comprehensive CRUD operations for wallet owner records, with Arabic language support and a responsive design. The application features a React frontend with shadcn/ui components, an Express.js backend with TypeScript, and uses Drizzle ORM for database operations with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **Data Layer**: Abstract storage interface with in-memory implementation
- **Validation**: Zod schemas shared between client and server
- **Development**: Hot reload with Vite integration in development mode

### Database & ORM
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless for cloud deployment
- **Development Storage**: In-memory storage implementation for development/testing

### Key Design Patterns
- **Monorepo Structure**: Shared types and schemas between client/server
- **Type Safety**: End-to-end TypeScript with shared validation schemas
- **Component Architecture**: Reusable UI components with consistent design system
- **Error Handling**: Centralized error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with RTL (right-to-left) language support

### Data Models
- **WalletOwner**: Core entity with fields for name, ID card, wallet number, phone, and timestamps
- **Validation**: Strict validation rules ensuring data integrity and uniqueness constraints
- **Search Functionality**: Full-text search across all owner fields

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Input Validation**: Server-side validation using Zod schemas
- **CORS**: Configured for cross-origin requests in development

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Modern TypeSQL ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **zod**: Runtime type validation and schema definition

### UI & Design System
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class composition
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Next-generation frontend build tool
- **tsx**: TypeScript execution environment for Node.js
- **@replit/vite-plugin-***: Replit-specific development plugins
- **drizzle-kit**: Database schema management and migrations

### Arabic Language Support
- **Google Fonts**: Tajawal and Cairo font families for Arabic typography
- **Font Awesome**: Icon library with comprehensive symbol coverage
- **RTL Support**: Built-in right-to-left text direction handling