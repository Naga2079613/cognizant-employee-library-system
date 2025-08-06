<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Cognizant Employee Library System

This is a React TypeScript web application for managing a company library system. The application includes:

## Key Features:
- Employee portal for browsing and requesting books
- Admin portal for managing books and requests
- Authentication system with role-based access
- Modern Material-UI design
- Responsive layout
- Notification system

## Architecture:
- Frontend: React 18 with TypeScript
- UI Library: Material-UI (MUI)
- Routing: React Router v6
- State Management: React Context API
- Mock Data Service: Local storage simulation
- Build Tool: Vite

## Code Guidelines:
- Use TypeScript for all components
- Follow Material-UI design patterns
- Implement proper error handling
- Use React hooks for state management
- Maintain clean separation of concerns
- Use proper TypeScript typing for all props and state

## Project Structure:
- `/src/components/` - React components organized by feature
- `/src/contexts/` - React context providers
- `/src/services/` - Data services and API calls
- `/src/types/` - TypeScript type definitions

## Development Notes:
- The app uses mock data for demonstration purposes
- Authentication is simplified for demo (real implementation would use proper auth)
- All data is stored in memory/localStorage (real app would use a database)
- Responsive design supports mobile and desktop views
