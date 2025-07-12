# AgoraCalendar - Microsoft Outlook Add-in

**Developed by AjayiWilliams LLC**

A comprehensive Microsoft Outlook Add-in designed for Investor Relations teams and investment analysts. AgoraCalendar provides advanced calendar management, event scheduling, conflict detection, and analytics capabilities within the Microsoft Office ecosystem.

## 🚀 Features

### **Role-Based Access Control**
- **IR Admin**: Full event management for single company
- **Analyst Manager**: Team oversight and multi-company event management
- **Investment Analyst**: Event viewing and RSVP management

### **Core Functionality**
- **📅 Advanced Calendar View**: Resource-based calendar with company rows and time columns
- **🎯 Event Management**: Create, edit, and manage investor events
- **📊 Analytics Dashboard**: Real-time event performance metrics
- **⚠️ Conflict Detection**: Intelligent scheduling conflict identification
- **📈 RSVP Tracking**: Comprehensive response management
- **📁 CSV Import/Export**: Bulk event data processing
- **🔍 Advanced Filtering**: Multi-criteria event search and filtering

### **Microsoft Integration**
- **Office.js Integration**: Native Outlook Add-in functionality
- **MSAL Authentication**: Secure Azure AD authentication
- **Microsoft Graph API**: Real-time calendar and user data sync
- **Bloomberg Dark Theme**: Professional financial industry styling

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: MSAL (Microsoft Authentication Library)
- **API Integration**: Microsoft Graph API
- **Data Processing**: PapaParse for CSV handling
- **Charts**: Recharts for analytics visualization
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## 📋 Prerequisites

- Node.js 18+ 
- npm or bun
- Microsoft 365 Developer Account
- Azure AD Application Registration

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agora-calendar-flow
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Microsoft Authentication
VITE_MSAL_CLIENT_ID=your-azure-ad-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:3000
VITE_MSAL_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# Office.js Configuration
VITE_OFFICE_CLIENT_ID=your-office-add-in-client-id
VITE_OFFICE_REDIRECT_URI=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
agora-calendar-flow/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── modals/          # Modal dialogs
│   │   ├── screens/         # Main application screens
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React contexts
│   ├── services/            # API and external services
│   ├── utils/               # Utility functions
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Key Components

- **`AgoraCalendar.tsx`**: Main calendar component with resource view
- **`EventManagementScreen.tsx`**: Event CRUD operations
- **`AnalyticsScreen.tsx`**: Performance metrics and charts
- **`DashboardScreen.tsx`**: Role-based dashboard views

### Authentication Flow

1. **MSAL Integration**: Secure Azure AD authentication
2. **Role Assignment**: Automatic role detection from Azure AD
3. **Graph API Access**: Calendar and user data synchronization
4. **Office.js Integration**: Native Outlook Add-in functionality

## 📊 Features in Detail

### **Calendar Management**
- Resource-based calendar view (companies as rows, days as columns)
- Drag-and-drop event scheduling
- Real-time conflict detection
- Multi-calendar support

### **Event Management**
- Create, edit, and delete events
- Bulk CSV import/export
- RSVP tracking and management
- Event categorization (earnings, meetings, conferences, roadshows)

### **Analytics Dashboard**
- Event performance metrics
- RSVP response rates
- Conflict analysis
- Company-specific insights

### **User Management**
- Role-based access control
- Company-specific data isolation
- User profile management
- Team collaboration features

## 🔒 Security

- **Azure AD Integration**: Enterprise-grade authentication
- **Role-Based Access**: Granular permissions per user role
- **Data Isolation**: Company-specific data segregation
- **Secure API Calls**: Token-based Microsoft Graph API access

## 🚀 Deployment

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
npm run preview
```

### **Outlook Add-in Deployment**
1. Build the application
2. Configure manifest.xml for Office Add-in
3. Deploy to web server
4. Register with Microsoft 365 Admin Center

## 📈 Roadmap

### **Phase 1** ✅
- [x] Core calendar functionality
- [x] Role-based authentication
- [x] Event management
- [x] Basic analytics

### **Phase 2** 🚧
- [ ] Advanced conflict detection
- [ ] Real-time notifications
- [ ] Mobile responsiveness
- [ ] Advanced reporting

### **Phase 3** 📋
- [ ] AI-powered scheduling suggestions
- [ ] Integration with Bloomberg Terminal
- [ ] Advanced analytics and ML insights
- [ ] Multi-language support

## 🤝 Contributing

### **Development Guidelines**
1. Follow TypeScript best practices
2. Use shadcn/ui components for consistency
3. Implement proper error handling
4. Write comprehensive tests
5. Follow the established code style

### **Code Style**
- Use TypeScript for type safety
- Follow React functional component patterns
- Implement proper error boundaries
- Use React hooks for state management

## 📞 Support

For technical support or feature requests, please contact:

**AjayiWilliams LLC**
- Email: support@ajayiwilliams.com
- Website: https://ajayiwilliams.com
- GitHub: [Repository Issues](https://github.com/ajayiwilliams/agora-calendar-flow/issues)

## 📄 License

Copyright © 2024 AjayiWilliams LLC. All rights reserved.

This project is proprietary software developed by AjayiWilliams LLC for enterprise use.

---

**Built with ❤️ by AjayiWilliams LLC** 