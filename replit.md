# Credit Calculator (Кредитный калькулятор)

## Overview
This is a credit calculator application built with React and Vite. It calculates annuity payments with support for exact and simplified interest calculation methods, as well as early repayment options.

**Current State:** Fully configured and running in Replit environment

**Last Updated:** November 27, 2025

## Project Architecture

### Tech Stack
- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.1.4
- **State Management:** Zustand 4.5.0
- **Styling:** Tailwind CSS 3.4.18
- **Date Handling:** date-fns 3.3.1

### Project Structure
The project follows Feature-Sliced Design (FSD) architecture:
- `src/app/` - Application entry point and global styles
- `src/pages/` - Page components (CreditCalculator)
- `src/features/` - Feature modules:
  - `credit-form/` - Credit parameters form and state management
  - `payment-schedule/` - Payment calculations, schedule generation, and early repayment
- `src/shared/` - Shared utilities, UI components, and configuration

### Key Features
- Annuity payment calculation
- Support for exact and simplified interest methods
- Early repayment functionality
- Payment schedule visualization
- Local storage persistence

## Replit Configuration

### Development Server
- **Port:** 5000
- **Host:** 0.0.0.0 (required for Replit proxy)
- **HMR:** Configured for Replit's HTTPS proxy (clientPort: 443)

### Workflow
- **Name:** Start application
- **Command:** `npm run dev`
- **Output:** Webview on port 5000

### Deployment
- **Type:** Static
- **Build Command:** `npm run build`
- **Public Directory:** `dist`

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Recent Changes
- **November 27, 2025:** Initial Replit setup
  - Configured Vite to use port 5000 with 0.0.0.0 host
  - Added HMR configuration for Replit's HTTPS proxy
  - Created workflow for development server
  - Set up deployment configuration for static hosting
  - Added Node.js .gitignore file
  - Installed all npm dependencies
