# Technical Stack

> Last Updated: July 25, 2025
> Version: 1.0.0

## Core Technologies

### Backend Framework
- **Framework:** Node.js
- **Version:** 21.0+
- **Language:** JavaScript/TypeScript

### Database
- **Primary:** SQLite (development/testing)
- **ORM:** Sequelize
- **Production:** Consider PostgreSQL for production deployment

## Frontend Stack

### JavaScript Framework
- **Framework:** Angular
- **Version:** Latest stable (18+)

### Import Strategy
- **Strategy:** Node.js modules
- **Package Manager:** npm
- **Node Version:** 22 LTS

### CSS Framework
- **Framework:** TailwindCSS
- **Version:** 4.0+
- **PostCSS:** Yes

### UI Components
- **Library:** DaisyUI
- **Version:** Latest
- **Installation:** Via npm

## Assets & Media

### Fonts
- **Provider:** Google Fonts
- **Loading Strategy:** Self-hosted for performance

### Icons
- **Library:** TailwindCSS icons
- **Implementation:** CSS classes

## Development Tools

### Code Quality
- **Linting:** ESLint for TypeScript/JavaScript
- **Formatting:** Prettier
- **Testing:** Jest for unit tests, Cypress for E2E

### Development Environment
- **IDE:** VS Code recommended
- **Dev Server:** Angular CLI dev server
- **API Development:** Node.js with Express.js

## Architecture Decisions

### Database Choice
- **Development:** SQLite for simplicity and local development
- **Production:** PostgreSQL for scalability and advanced features
- **Justification:** Start simple, scale when needed

### Frontend Architecture
- **Pattern:** Component-based architecture with Angular modules
- **State Management:** Angular services with RxJS for reactive state
- **Routing:** Angular Router for SPA navigation

### Backend Architecture
- **Pattern:** REST API with Express.js
- **Authentication:** JWT tokens
- **File Structure:** Modular structure with controllers, services, and repositories

## Deployment Considerations

### Environment Setup
- **Development:** Local SQLite + Angular dev server
- **Staging:** Docker containers with PostgreSQL
- **Production:** Cloud deployment (Digital Ocean/AWS)

### CI/CD Pipeline
- **Platform:** GitHub Actions
- **Triggers:** Push to main/staging branches
- **Tests:** Automated testing before deployment
