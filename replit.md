# VoyGPT - AI Brand Assistant

## Overview

This repository contains VoyGPT, a mobile-optimized full-stack AI Brand Assistant application built with React frontend and Express backend. The application serves as an intelligent companion for mastering AI tools and building powerful brands, organized around six main categories: Writing Tools, Brand Strategy, Image & Art, Marketing, Tech Integration, and Analytics. The app features a welcome modal for first-time users with Instagram integration and is fully optimized for mobile devices with touch-friendly interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API with structured route organization
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL store
- **AI Integration**: OpenAI GPT-4o for conversational AI responses

## Key Components

### Database Schema
The application uses PostgreSQL with Drizzle ORM, featuring:
- **Users table**: Stores user authentication data (required for Replit Auth)
- **Sessions table**: Handles session persistence (required for Replit Auth)
- **Conversations table**: Tracks user conversation history with categories
- **Messages table**: Stores individual messages within conversations

### Authentication System
- Replit Auth integration with OpenID Connect
- Passport.js strategy for authentication flow
- Session-based authentication with PostgreSQL storage
- User profile management with automatic user creation/updates

### AI Service Integration
- OpenAI API integration with GPT-4o model
- Category-specific AI assistants with tailored prompts
- Conversation management with automatic title generation
- Streaming responses for real-time interaction

### UI/UX Design
- Mobile-optimized responsive design with glass morphism effects
- Dark theme with custom color scheme
- Touch-friendly navigation with 44px+ touch targets
- iOS safe area support and web app capabilities
- Enhanced visual feedback with active states and animations
- Single-column mobile layout for better usability
- Category-based AI assistant selection
- Real-time chat interface with suggested messages
- Welcome modal with Instagram integration (instagram.com/voygpt)

## Data Flow

1. **Authentication Flow**: Users authenticate through Replit Auth, creating/updating user records
2. **Conversation Creation**: Users select AI assistant categories and create new conversations
3. **Message Exchange**: Real-time chat with AI assistants, storing all interactions
4. **State Management**: TanStack Query handles API calls, caching, and optimistic updates
5. **Session Persistence**: User sessions maintained across browser restarts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **openai**: Official OpenAI API client
- **@tanstack/react-query**: Server state management
- **express-session + connect-pg-simple**: Session management

### UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Frontend build tool with React plugin
- **typescript**: Type safety across the stack
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory using Vite
- Backend bundles to `dist/index.js` using esbuild
- Single production server serves both static files and API

### Environment Configuration
- **Development**: Uses tsx for hot reloading, Vite dev server
- **Production**: Node.js serves bundled application
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **AI Integration**: Requires `OPENAI_API_KEY` for OpenAI API access
- **Authentication**: Requires Replit-specific environment variables

### Infrastructure Requirements
- PostgreSQL database (configured for Neon serverless)
- Node.js runtime environment
- Session storage in database
- WebSocket support for real-time features

The application is designed as a monorepo with shared TypeScript schemas between frontend and backend, enabling type safety across the full stack while maintaining clear separation of concerns.