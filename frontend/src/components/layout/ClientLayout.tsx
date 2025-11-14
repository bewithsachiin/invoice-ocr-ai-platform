import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  CameraOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const { Header, Sider, Content } = Layout

export default function ClientLayout() {
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
      label: 'My Profile',
      onClick: () => navigate('/client/profile'),
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

  // Grouped menu items with section headers
  const menuItems = [
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">MAIN</span>,
      children: [
        {
          key: '/client/dashboard',
          icon: <DashboardOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/client/dashboard">Dashboard</Link>
              <Badge count={3} className="menu-badge" />
            </div>
          ),
        },
        {
          key: '/client/invoices',
          icon: <FileTextOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/client/invoices">My Invoices</Link>
              <Badge count={8} className="menu-badge" />
            </div>
          ),
        },
        {
          key: '/client/upload/camera',
          icon: <CameraOutlined />,
          label: <Link to="/client/upload/camera">Camera Upload</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ANALYTICS</span>,
      children: [
        {
          key: '/client/reports',
          icon: <BarChartOutlined />,
          label: <Link to="/client/reports">Reports</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">DEVELOPER</span>,
      children: [
        {
          key: '/client/api-keys',
          icon: <ApiOutlined />,
          label: <Link to="/client/api-keys">API Keys</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ACCOUNT</span>,
      children: [
        {
          key: '/client/profile',
          icon: <UserOutlined />,
          label: <Link to="/client/profile">Profile</Link>,
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
              <div className="logo-subtitle">Enterprise Edition</div>
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
                <div className="user-role">Client Portal</div>
              </div>
            </div>
            <div className="user-card-stats">
              <div className="stat-item">
                <span className="stat-label">Storage</span>
                <span className="stat-value">2.4 GB / 5 GB</span>
              </div>
              <div className="storage-bar">
                <div className="storage-bar-fill" style={{ width: '48%' }}></div>
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
            <Badge count={3}>
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
