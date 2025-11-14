import { Card, DatePicker, Button, Space, Row, Col } from 'antd'
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '@/components/common/StatCard'

const { RangePicker } = DatePicker

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

const categoryData = [
  { name: 'Office Supplies', amount: 12000 },
  { name: 'Software', amount: 18000 },
  { name: 'Marketing', amount: 8500 },
  { name: 'Travel', amount: 15000 },
  { name: 'Utilities', amount: 6500 },
]

const monthlyData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 12000 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 15000 },
  { month: 'May', amount: 11200 },
  { month: 'Jun', amount: 17500 },
]

export default function ClientReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-gray-500 mt-1">Personal expense reports and insights</p>
        </div>
        <Space>
          <Button icon={<FileExcelOutlined />}>Export Excel</Button>
          <Button icon={<FilePdfOutlined />}>Export PDF</Button>
        </Space>
      </div>

      <Card>
        <Space size="large" wrap>
          <RangePicker />
          <Button type="primary" icon={<DownloadOutlined />}>
            Generate Report
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Expenses" value={74000} prefix="$" color="#f5222d" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="This Month" value={17500} prefix="$" color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Average" value={12333} prefix="$" color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Invoices" value={48} color="#722ed1" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Expenses" className="card-hover">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#1677ff"
                  strokeWidth={2}
                  name="Amount ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Breakdown" className="card-hover">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${(entry.amount / 1000).toFixed(1)}k`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Expenses by Category" className="card-hover">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#1677ff" name="Amount ($)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
