import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Statistic,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Descriptions,
  Timeline,
  Avatar,
} from 'antd'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatusBadge from '@/components/common/StatusBadge'
import ConfidenceBadge from '@/components/common/ConfidenceBadge'
import { mockClients, mockInvoices, mockCategories } from '@/utils/mockData'
import dayjs from 'dayjs'

export default function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Find client
  const client = mockClients.find((c) => c.id === clientId)

  // Get client's invoices
  const clientInvoices = mockInvoices.filter((inv) => inv.clientId === clientId)

  // Calculate stats
  const stats = useMemo(() => {
    const totalInvoices = clientInvoices.length
    const approvedInvoices = clientInvoices.filter((inv) => inv.status === 'approved').length
    const pendingInvoices = clientInvoices.filter((inv) => inv.status === 'pending').length
    const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const averageAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0
    const lastInvoiceDate = clientInvoices.length > 0
      ? Math.max(...clientInvoices.map(inv => new Date(inv.invoiceDate).getTime()))
      : null

    // Monthly trend data
    const monthlyData: { [key: string]: { month: string; amount: number; count: number } } = {}
    clientInvoices.forEach((inv) => {
      const month = dayjs(inv.invoiceDate).format('MMM YYYY')
      if (!monthlyData[month]) {
        monthlyData[month] = { month, amount: 0, count: 0 }
      }
      monthlyData[month].amount += inv.totalAmount
      monthlyData[month].count += 1
    })

    // Category breakdown
    const categoryData: { [key: string]: { name: string; amount: number; count: number } } = {}
    clientInvoices.forEach((inv) => {
      const category = inv.categoryName || 'Uncategorized'
      if (!categoryData[category]) {
        categoryData[category] = { name: category, amount: 0, count: 0 }
      }
      categoryData[category].amount += inv.totalAmount
      categoryData[category].count += 1
    })

    return {
      totalInvoices,
      approvedInvoices,
      pendingInvoices,
      totalAmount,
      averageAmount,
      lastInvoiceDate,
      monthlyTrend: Object.values(monthlyData).sort((a, b) =>
        dayjs(a.month, 'MMM YYYY').valueOf() - dayjs(b.month, 'MMM YYYY').valueOf()
      ),
      categoryBreakdown: Object.values(categoryData).sort((a, b) => b.amount - a.amount),
    }
  }, [clientInvoices])

  if (!client) {
    return (
      <div className="enterprise-page-content">
        <Card>
          <p>Client not found</p>
          <Button onClick={() => navigate('/admin/clients')}>Back to Clients</Button>
        </Card>
      </div>
    )
  }

  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <span className="font-semibold text-slate-900">{text}</span>,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number, record: any) => (
        <span className="font-semibold text-emerald-600">
          {record.currency} ${amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />,
    },
    {
      title: 'Confidence',
      dataIndex: 'ocrConfidence',
      key: 'ocrConfidence',
      render: (confidence: number) => <ConfidenceBadge confidence={confidence} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} size="small">
            View
          </Button>
          <Button type="link" icon={<DownloadOutlined />} size="small">
            Download
          </Button>
        </Space>
      ),
    },
  ]

  const handleAddInvoice = () => {
    form.validateFields().then((values) => {
      console.log('New invoice:', values)
      message.success('Invoice added successfully!')
      setIsAddInvoiceModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <div className="enterprise-page-content">
      {/* Header */}
      <div className="enterprise-page-header">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/clients')}
              size="large"
            >
              Back to Clients
            </Button>
            <div>
              <h1 className="enterprise-page-title flex items-center gap-3">
                <Avatar size={48} style={{ backgroundColor: '#3b82f6' }}>
                  {client.name.charAt(0)}
                </Avatar>
                {client.name}
              </h1>
              <p className="enterprise-page-subtitle">
                Client details, invoices, and analytics
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddInvoiceModalVisible(true)}
            className="enterprise-btn-primary"
            size="large"
          >
            Add Invoice
          </Button>
        </div>
      </div>

      {/* Client Info Card */}
      <Card className="enterprise-card mb-8" bordered={false}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} size="middle">
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Email</span>}
          >
            <Space>
              <MailOutlined className="text-blue-500" />
              {client.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Phone</span>}
          >
            <Space>
              <PhoneOutlined className="text-blue-500" />
              {client.phone || '-'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Company</span>}
          >
            {client.companyName || '-'}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Status</span>}
          >
            <Tag color="success">{client.status.toUpperCase()}</Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Address</span>}
            span={2}
          >
            <Space>
              <EnvironmentOutlined className="text-blue-500" />
              {client.address || '-'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Member Since</span>}
          >
            <Space>
              <CalendarOutlined className="text-blue-500" />
              {dayjs(client.createdAt).format('MMM DD, YYYY')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className="font-semibold text-slate-600">Last Invoice</span>}
          >
            {stats.lastInvoiceDate ? dayjs(stats.lastInvoiceDate).format('MMM DD, YYYY') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="enterprise-grid mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-blue">
              <FileTextOutlined />
            </div>
            <div className="stat-card-value">{stats.totalInvoices}</div>
            <div className="stat-card-title">Total Invoices</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              {stats.approvedInvoices} Approved
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-orange">
              <ClockCircleOutlined />
            </div>
            <div className="stat-card-value">{stats.pendingInvoices}</div>
            <div className="stat-card-title">Pending Review</div>
            <div className="trend-indicator trend-neutral mt-3">
              {((stats.pendingInvoices / stats.totalInvoices) * 100).toFixed(1)}% of total
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-green">
              <DollarOutlined />
            </div>
            <div className="stat-card-value">${stats.totalAmount.toLocaleString()}</div>
            <div className="stat-card-title">Total Spent</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              Avg ${stats.averageAmount.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enterprise-stat-card" bordered={false}>
            <div className="stat-card-icon icon-purple">
              <CheckCircleOutlined />
            </div>
            <div className="stat-card-value">
              {((stats.approvedInvoices / stats.totalInvoices) * 100).toFixed(0)}%
            </div>
            <div className="stat-card-title">Approval Rate</div>
            <div className="trend-indicator trend-up mt-3">
              <ArrowUpOutlined />
              {stats.approvedInvoices}/{stats.totalInvoices}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Tabs
        defaultActiveKey="invoices"
        size="large"
        className="enterprise-tabs"
        items={[
          {
            key: 'invoices',
            label: (
              <span className="flex items-center gap-2">
                <FileTextOutlined />
                Invoices ({stats.totalInvoices})
              </span>
            ),
            children: (
              <Card className="enterprise-table-card" bordered={false}>
                <Table
                  columns={invoiceColumns}
                  dataSource={clientInvoices}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  className="enterprise-table"
                />
              </Card>
            ),
          },
          {
            key: 'analytics',
            label: (
              <span className="flex items-center gap-2">
                📊 Analytics
              </span>
            ),
            children: (
              <div className="space-y-6">
                {/* Monthly Trend Chart */}
                <Card
                  title="Monthly Invoice Trend"
                  className="enterprise-chart-card"
                  bordered={false}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#64748b"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#64748b"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Amount ($)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Invoice Count"
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Category Breakdown */}
                <Card
                  title="Spending by Category"
                  className="enterprise-chart-card"
                  bordered={false}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      />
                      <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        fill="#3b82f6"
                        name="Amount ($)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.categoryBreakdown.map((cat) => (
                      <div key={cat.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-slate-900">{cat.name}</div>
                          <div className="text-sm text-slate-600">{cat.count} invoices</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600">${cat.amount.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">
                            {((cat.amount / stats.totalAmount) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ),
          },
          {
            key: 'history',
            label: (
              <span className="flex items-center gap-2">
                📋 Activity History
              </span>
            ),
            children: (
              <Card className="enterprise-card" bordered={false}>
                <Timeline
                  mode="left"
                  items={clientInvoices.slice(0, 10).map((inv) => ({
                    color: inv.status === 'approved' ? 'green' : inv.status === 'pending' ? 'blue' : 'red',
                    children: (
                      <div>
                        <div className="font-semibold text-slate-900">
                          {inv.invoiceNumber} - {inv.vendorName}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          ${inv.totalAmount.toLocaleString()} • {inv.categoryName}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {dayjs(inv.invoiceDate).format('MMM DD, YYYY HH:mm')}
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    ),
                  }))}
                />
              </Card>
            ),
          },
          {
            key: 'summary',
            label: (
              <span className="flex items-center gap-2">
                📄 Summary Report
              </span>
            ),
            children: (
              <Card className="enterprise-card" bordered={false}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Client Summary Report</h3>
                    <p className="text-slate-600">Generated on {dayjs().format('MMMM DD, YYYY')}</p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-bold text-blue-900 mb-2">Overview</h4>
                    <p className="text-blue-800">
                      {client.name} has been a client since {dayjs(client.createdAt).format('MMMM YYYY')}.
                      Over this period, they have submitted {stats.totalInvoices} invoices totaling ${stats.totalAmount.toLocaleString()}.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Key Metrics</h4>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic
                          title="Average Invoice Value"
                          value={stats.averageAmount}
                          precision={2}
                          prefix="$"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Approval Rate"
                          value={(stats.approvedInvoices / stats.totalInvoices) * 100}
                          precision={1}
                          suffix="%"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Total Invoices"
                          value={stats.totalInvoices}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Pending Review"
                          value={stats.pendingInvoices}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Top Categories</h4>
                    <div className="space-y-2">
                      {stats.categoryBreakdown.slice(0, 5).map((cat, index) => (
                        <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                          <span className="font-medium">
                            #{index + 1} {cat.name}
                          </span>
                          <span className="text-emerald-600 font-bold">
                            ${cat.amount.toLocaleString()} ({cat.count} invoices)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="primary" icon={<DownloadOutlined />} size="large">
                      Download PDF Report
                    </Button>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      {/* Add Invoice Modal */}
      <Modal
        title={
          <span className="text-xl font-bold">
            Add Invoice for {client.name}
          </span>
        }
        open={isAddInvoiceModalVisible}
        onCancel={() => {
          setIsAddInvoiceModalVisible(false)
          form.resetFields()
        }}
        onOk={handleAddInvoice}
        width={700}
        okText="Add Invoice"
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="invoiceNumber"
                label="Invoice Number"
                rules={[{ required: true, message: 'Please enter invoice number' }]}
              >
                <Input placeholder="INV-2024-XXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vendorName"
                label="Vendor Name"
                rules={[{ required: true, message: 'Please enter vendor name' }]}
              >
                <Input placeholder="Vendor name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="invoiceDate"
                label="Invoice Date"
                rules={[{ required: true, message: 'Please select invoice date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalAmount"
                label="Total Amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <Input type="number" prefix="$" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {mockCategories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="file" label="Upload Invoice Document">
            <Upload.Dragger
              name="file"
              maxCount={1}
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, PNG, JPG (max 10MB)
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Additional notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
