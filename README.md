# Cognizant Employee Library System

A comprehensive React TypeScript web application for managing a company library system, enabling employees to browse and request books while providing administrators with tools to manage inventory and requests.

## 🌐 Live Demo

**GitHub Pages**: [View Live Application](https://naga2079613.github.io/cognizant-employee-library-system/)

## 🚀 Features

### Employee Portal
- **User Authentication**: Secure email-based login system
- **Book Catalog**: Browse and search through available books
- **Request Management**: Submit book requests with expected return dates
- **Request Tracking**: View status and history of all book requests
- **Dashboard**: Overview of available books and personal request statistics

### Admin Portal
- **Dashboard**: Comprehensive overview of library statistics and metrics
- **Book Management**: Add, edit, and delete books from the catalog
- **Request Management**: Review, approve, reject, and track book requests
- **Inventory Control**: Manage book availability and circulation
- **Status Updates**: Update request status (pending → approved → dispatched → returned)

### Core Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: In-app notifications for status updates
- **Role-based Access**: Separate interfaces for employees and administrators
- **Search & Filter**: Advanced search capabilities with category filtering
- **Modern UI**: Clean, intuitive interface using Material-UI components

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Data Storage**: Local storage (demo purposes)
- **Icons**: Material-UI Icons

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Demo Credentials

The application includes demo accounts for testing:

**Admin Account:**
- Email: `admin@cognizant.com`
- Password: `password123`

**Employee Accounts:**
- Email: `john.doe@cognizant.com` / Password: `password123`
- Email: `jane.smith@cognizant.com` / Password: `password123`

### Getting Started

1. **Login** with one of the demo accounts
2. **For Employees**: 
   - Browse the book catalog
   - Request books by clicking "Request Book"
   - Track your requests in "My Requests"
3. **For Admins**:
   - View overall statistics on the dashboard
   - Manage books in "Manage Books"
   - Process requests in "Manage Requests"

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx
│   ├── EmployeePortal/
│   │   ├── Dashboard.tsx
│   │   ├── BookCatalog.tsx
│   │   └── RequestHistory.tsx
│   ├── AdminPortal/
│   │   ├── Dashboard.tsx
│   │   ├── ManageBooks.tsx
│   │   └── ManageRequests.tsx
│   └── common/
│       ├── Navbar.tsx
│       ├── NotificationList.tsx
│       └── ProtectedRoute.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── services/
│   └── dataService.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📊 Features Breakdown

### Authentication System
- Context-based authentication state management
- Protected routes based on user roles
- Persistent login sessions using localStorage

### Book Management
- Complete CRUD operations for books
- Category-based organization
- ISBN and metadata tracking
- Availability management

### Request Workflow
1. **Employee Request**: Submit request with expected return date
2. **Admin Review**: Approve or reject with comments
3. **Dispatch**: Mark approved books as dispatched
4. **Return**: Process book returns and update availability

### Notification System
- Real-time feedback for user actions
- Auto-dismissing notifications
- Different notification types (success, error, warning, info)

## 🎨 UI/UX Features

- **Material Design**: Following Google's Material Design principles
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation support
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### GitHub Pages Deployment

This project is configured with GitHub Actions for automatic deployment to GitHub Pages.

#### Setup Instructions:

1. **Create GitHub Repository**:
   ```bash
   git remote add origin https://github.com/Naga2079613/cognizant-employee-library-system.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch (created automatically by the workflow)

3. **Automatic Deployment**:
   - Every push to the `main` branch triggers automatic build and deployment
   - The workflow builds the React app and deploys to GitHub Pages
   - Live site will be available at: `https://naga2079613.github.io/cognizant-employee-library-system/`

#### Manual Deployment:

```bash
# Build the project
npm run build

# Deploy the dist folder to your hosting service
# The built files will be in the 'dist' directory
```

### Alternative Hosting Options:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **Firebase Hosting**: Use Firebase CLI to deploy
- **AWS S3**: Static website hosting with CloudFront CDN

## 🔮 Future Enhancements

### Backend Integration
- Replace mock data service with actual API
- Database integration (MongoDB, PostgreSQL, or Firebase)
- Real authentication system (JWT, OAuth)

### Advanced Features
- Email notifications for status updates
- Book recommendations based on reading history
- Advanced reporting and analytics
- Barcode scanning for book management
- Due date reminders and late fees
- Multi-library support

---

**Note**: This is a demonstration application using mock data. In a production environment, you would need to implement proper backend services, database integration, and security measures.
