# Invoice OCR Platform - Frontend

A comprehensive, production-ready React frontend for Invoice OCR Processing Platform with beautiful UI, full feature set, and mobile camera support.

## Features

### Admin Portal
- **Dashboard**: Real-time analytics, charts, and statistics
- **Invoice Management**: Advanced table with filters, search, bulk actions, OCR confidence indicators
- **Camera Upload**: Capture invoice photos directly from browser (mobile & desktop)
- **Client Management**: Full CRUD operations, email/WhatsApp monitoring toggles
- **Category Management**: Organize invoices with customizable categories
- **Integrations**:
  - Email (Gmail, Outlook, IMAP)
  - WhatsApp with QR code authentication
  - Accounting systems (QuickBooks, Xero, etc.)
- **Reports**: Interactive charts and data visualization
- **Settings**: Organization settings, API key management, audit logs

### Client Portal
- **Dashboard**: Personal metrics and spending overview
- **Invoice Management**: View and upload invoices
- **Camera Upload**: Mobile-friendly invoice capture
- **Reports**: Personal expense reports and analytics
- **Profile Management**: Update profile, change password, notification preferences

### Key Technologies
- **React 18** with TypeScript
- **Ant Design** for beautiful UI components
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching
- **Zustand** for state management
- **React Router v6** for navigation
- **Recharts** for data visualization
- **React Webcam** for camera functionality
- **Vite** for blazing fast development

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ConfidenceBadge.tsx
│   │   │   └── CameraCapture.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── ClientLayout.tsx
│   │   │   └── AuthLayout.tsx
│   ├── pages/
│   │   ├── admin/           # Admin pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── InvoiceCameraPage.tsx
│   │   │   ├── ClientsPage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── IntegrationsPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── client/          # Client pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── CameraPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ReportsPage.tsx
│   │   └── auth/            # Auth pages
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   └── themeStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utilities
│   │   └── mockData.ts
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd /root/invoice-ocr-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Client Account:**
- Email: `client@example.com`
- Password: `client123`

Or simply click the demo buttons on the login page!

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## Features Overview

### 1. Authentication System
- Beautiful login/register pages with gradient backgrounds
- Demo credentials for quick access
- Role-based routing (Admin/Client)
- Persistent authentication with Zustand

### 2. Admin Dashboard
- **4 Key Metric Cards**: Total invoices, pending reviews, total amount, active clients
- **Interactive Charts**:
  - Line chart for invoice trends
  - Pie chart for category breakdown
  - Bar chart for monthly spending
- **Recent Invoices Table**: Quick overview with actions
- **Responsive Design**: Works on all screen sizes

### 3. Invoice Management
- **Advanced Data Table**:
  - Sort by any column
  - Filter by status, client, category
  - Date range picker
  - Full-text search
- **Bulk Actions**: Approve, reject, or delete multiple invoices
- **Detailed Modal**: View complete invoice information
- **OCR Confidence Indicators**: Visual badges showing processing quality
- **Status Badges**: Color-coded status indicators
- **Export**: CSV/Excel export functionality

### 4. Camera Upload Feature
- **Desktop & Mobile Support**: Works on all devices
- **Real-time Preview**: See captured image before upload
- **Retake Option**: Easily capture again if needed
- **Client Selection**: Assign invoices to specific clients
- **Dual Mode**: Both camera capture and file upload
- **Progress Indicators**: Visual feedback during upload

### 5. Client Management
- **Full CRUD Operations**: Create, read, update, delete clients
- **Email Monitoring Toggle**: Enable/disable per client
- **WhatsApp Integration**: Per-client WhatsApp monitoring
- **Statistics**: Invoice count and total spending per client
- **Search & Filter**: Easy client lookup

### 6. Integrations Hub
- **Email Integration**:
  - Multiple email accounts
  - Gmail, Outlook, IMAP support
  - OAuth connection
  - Test connection feature
  - Sync status and last sync time

- **WhatsApp Integration**:
  - QR code authentication
  - Connection status monitoring
  - Phone number management

- **Accounting Systems**:
  - QuickBooks, Xero support
  - Custom API configuration
  - Field mapping interface
  - Manual sync trigger

### 7. Reports & Analytics
- **Multiple Report Types**: Summary, by category, by vendor, by client
- **Date Range Selection**: Custom date filtering
- **Interactive Charts**:
  - Line charts for trends
  - Pie charts for distribution
  - Bar charts for comparisons
- **Export Options**: Excel and PDF export

### 8. Settings & Configuration
- **Organization Settings**: Name, email, address, OCR thresholds
- **API Key Management**: Generate, view, copy, delete API keys
- **Audit Logs**: Complete activity tracking
- **Language Settings**: Multi-language support
- **Auto-approve**: Configure automatic approval rules

### 9. Client Portal
- **Personal Dashboard**: Individual metrics and charts
- **Invoice View**: See all personal invoices
- **Upload Capability**: Upload invoices via camera or file
- **Reports**: Personal expense analytics
- **Profile Management**: Update personal information

### 10. UI/UX Features
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Beautiful placeholders for empty data
- **Notifications**: Toast messages for user feedback
- **Smooth Animations**: Transitions and hover effects
- **Consistent Icons**: Ant Design Icons throughout
- **Professional Color Scheme**: Blues, greens, and reds

## Camera Feature Details

The camera feature is a highlight of this platform:

1. **Browser API Integration**: Uses modern `getUserMedia` API
2. **Device Detection**: Automatically selects best camera
3. **Camera Switching**: Toggle between front and rear cameras on mobile
4. **High Resolution**: Captures at 1280x720 for optimal OCR
5. **Preview Mode**: Review before submitting
6. **Error Handling**: Graceful fallbacks if camera unavailable
7. **Mobile First**: Optimized for mobile invoice capture

## Mock Data

The application includes comprehensive mock data:
- 10+ sample invoices with realistic data
- 5+ clients with complete information
- 7 categories with keywords and account codes
- Email integrations (Gmail, Outlook)
- WhatsApp integration
- QuickBooks integration
- API keys
- Audit logs

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Sidebar automatically collapses on mobile devices.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with camera support

## Performance Optimizations

- Code splitting with React Router
- Lazy loading for heavy components
- Optimized bundle size with Vite
- Tree shaking for unused code
- Production build optimizations

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel/Netlify

Simply connect your repository and deploy the `frontend` directory.

## API Integration

To connect to the backend API:

1. Update the proxy in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8000',
      changeOrigin: true,
    },
  },
}
```

2. Replace mock data calls in components with actual API calls using TanStack Query.

## Customization

### Theme Colors

Edit `tailwind.config.js` and `src/main.tsx` ConfigProvider to change the color scheme.

### Add New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in layout components

### Add New Components

Create in `src/components/common/` for reusable components.

## Troubleshooting

### Camera Not Working
- Ensure HTTPS (required for camera access)
- Check browser permissions
- Verify camera hardware availability

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist`

## Contributing

This is a production-ready demo. Feel free to customize and extend based on your requirements.

## License

MIT License - feel free to use this for your projects!

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, Ant Design, and modern web technologies.
