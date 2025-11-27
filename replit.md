# Credit Calculator (Кредитный калькулятор)

## Overview
This is a credit calculator application built with React and Vite. It calculates annuity payments with support for exact and simplified interest calculation methods, as well as early repayment options.

**Current State:** Fully configured and running in Replit environment with enhanced UI

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
  - `ui/` - Reusable UI components (Button, Input, Select, Card, Slider, Tooltip)
  - `lib/` - Utility functions (formatting, validation, dates)
  - `config/` - Application constants

### Key Features
- Annuity payment calculation
- Support for exact and simplified interest methods
- Early repayment functionality
- Payment schedule visualization with year grouping
- Local storage persistence
- Real-time validation with error highlighting
- Tooltips explaining financial terms
- Mobile-responsive design

## Recent UI Improvements (November 27, 2025)
1. **CSS Animations** - Smooth fade-in, slide-up, and scale transitions
2. **Slider Components** - Interactive sliders for credit amount, interest rate, and term
3. **Real-time Validation** - Instant feedback with error highlighting
4. **Tooltips** - Explanatory tooltips for financial terms
5. **Sticky Table Header** - Fixed header when scrolling payment schedule
6. **Early Repayment Highlighting** - Green highlighting for early repayment rows
7. **Year Grouping** - Collapsible year sections with totals
8. **Mobile Responsiveness** - Improved layout for mobile devices

## Replit Configuration

### Development Server
- **Port:** 5000
- **Host:** 0.0.0.0 (required for Replit proxy)
- **Allowed Hosts:** All hosts allowed for Replit proxy compatibility
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

## Component Library

### Shared UI Components
- **Button** - Primary, secondary, outline, danger variants with loading state
- **Input** - Form input with label, error, and helper text
- **Select** - Dropdown select with options
- **Card** - Container with optional title and padding variants
- **Slider** - Range slider with input field, tooltips, and value formatting
- **Tooltip** - Hover/focus tooltip with positioning options
