import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { ConfigProvider, theme, Spin } from 'antd'

// Layouts
import AdminLayout from '@/components/layout/AdminLayout'
import ClientLayout from '@/components/layout/ClientLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import InvoicesPage from '@/pages/admin/InvoicesPage'
import InvoiceCameraPage from '@/pages/admin/InvoiceCameraPage'
import ClientsPage from '@/pages/admin/ClientsPage'
import ClientDetailPage from '@/pages/admin/ClientDetailPage'
import CategoriesPage from '@/pages/admin/CategoriesPage'
import IntegrationsPage from '@/pages/admin/IntegrationsPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import ReportsPage from '@/pages/admin/ReportsPage'

// Client Pages
import ClientDashboard from '@/pages/client/Dashboard'
import ClientInvoicesPage from '@/pages/client/InvoicesPage'
import ClientCameraPage from '@/pages/client/CameraPage'
import ClientProfilePage from '@/pages/client/ProfilePage'
import ClientReportsPage from '@/pages/client/ReportsPage'
import APIKeysPage from '@/pages/client/APIKeysPage'

function App() {
  const { isAuthenticated, user, isHydrated } = useAuthStore()
  const { isDarkMode } = useThemeStore()
  const [isReady, setIsReady] = useState(false)

  // Wait for store to rehydrate from localStorage before rendering
  useEffect(() => {
    if (isHydrated) {
      setIsReady(true)
    } else {
      // Force hydration check after a brief delay
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isHydrated])

  // Show loading spinner while rehydrating
  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Admin Routes */}
          {isAuthenticated && user?.role === 'admin' && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/camera" element={<InvoiceCameraPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/:clientId" element={<ClientDetailPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          )}

          {/* Protected Client Routes */}
          {isAuthenticated && user?.role === 'client' && (
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="invoices" element={<ClientInvoicesPage />} />
              <Route path="upload/camera" element={<ClientCameraPage />} />
              <Route path="reports" element={<ClientReportsPage />} />
              <Route path="api-keys" element={<APIKeysPage />} />
              <Route path="profile" element={<ClientProfilePage />} />
            </Route>
          )}

          {/* Default Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/client/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
