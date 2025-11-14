import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
  ApiOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CameraOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  // Grouped menu items with sections - ENTERPRISE STYLE
  const menuItems = [
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">MAIN</span>,
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/dashboard">Dashboard</Link>
              <Badge count={5} className="menu-badge" />
            </div>
          ),
        },
        {
          key: '/admin/invoices',
          icon: <FileTextOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/invoices">Invoices</Link>
              <Badge count={23} className="menu-badge" />
            </div>
          ),
        },
        {
          key: '/admin/invoices/camera',
          icon: <CameraOutlined />,
          label: <Link to="/admin/invoices/camera">Camera Upload</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">MANAGEMENT</span>,
      children: [
        {
          key: '/admin/clients',
          icon: <TeamOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/clients">Clients</Link>
              <Badge count={42} className="menu-badge" />
            </div>
          ),
        },
        {
          key: '/admin/categories',
          icon: <FolderOutlined />,
          label: <Link to="/admin/categories">Categories</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ANALYTICS</span>,
      children: [
        {
          key: '/admin/reports',
          icon: <BarChartOutlined />,
          label: <Link to="/admin/reports">Reports</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">SYSTEM</span>,
      children: [
        {
          key: '/admin/integrations',
          icon: <ApiOutlined />,
          label: <Link to="/admin/integrations">Integrations</Link>,
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">Settings</Link>,
        },
      ],
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        className="enterprise-sidebar"
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo Section */}
        <div className="sidebar-logo" style={{ flexShrink: 0 }}>
          <div className="logo-icon-wrapper">
            <FileTextOutlined className="logo-icon" />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">Invoice OCR</div>
              <div className="logo-subtitle">Admin Portal</div>
            </div>
          )}
        </div>

        {/* Scrollable Menu Container */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="enterprise-menu"
          />
        </div>

        {/* Bottom User Card */}
        {!collapsed && (
          <div className="sidebar-user-card" style={{ flexShrink: 0 }}>
            <div className="user-card-content">
              <Avatar size={40} src={user?.avatar} icon={<UserOutlined />} className="user-avatar" />
              <div className="user-info">
                <div className="user-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
            <div className="user-card-stats">
              <div className="stat-item">
                <span className="stat-label">System Status</span>
                <span className="stat-value">✓ Operational</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">42 online</span>
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240 }}>
        <Header
          className="enterprise-header"
          style={{
            padding: 0,
            background: isDarkMode ? '#141414' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space size="large">
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={toggleTheme}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            />
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                <span className="hidden md:inline">
                  {user?.firstName} {user?.lastName}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            background: '#f8fafc',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
