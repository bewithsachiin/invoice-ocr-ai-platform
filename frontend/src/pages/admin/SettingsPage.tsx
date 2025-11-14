import { Tabs, Card, Form, Input, Button, Switch, Select, Table, Space, message, InputNumber, Tag } from 'antd'
import { PlusOutlined, CopyOutlined, DeleteOutlined, SettingOutlined, ApiOutlined, AuditOutlined } from '@ant-design/icons'
import { mockAPIKeys, mockAuditLogs } from '@/utils/mockData'

const { Option } = Select

export default function SettingsPage() {
  const [form] = Form.useForm()

  const OrganizationTab = (
    <Card>
      <Form form={form} layout="vertical" onFinish={() => message.success('Settings saved')}>
        <Form.Item label="Organization Name" name="orgName" initialValue="Acme Corporation">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" initialValue="admin@acme.com">
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" initialValue="+1-555-0100">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address" initialValue="123 Business St, New York, NY">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="OCR Confidence Threshold" name="ocrThreshold" initialValue={85}>
          <InputNumber min={0} max={100} addonAfter="%" />
        </Form.Item>
        <Form.Item label="Default Language" name="language" initialValue="en">
          <Select>
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
            <Option value="de">German</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Email Notifications" name="emailNotif" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Auto-approve High Confidence" name="autoApprove" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit">Save Settings</Button>
      </Form>
    </Card>
  )

  const APIKeysTab = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage API keys for integrations</p>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.success('API key generated')}>
          Generate New Key
        </Button>
      </div>
      <Table
        dataSource={mockAPIKeys}
        rowKey="id"
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
          },
          {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
            render: (key: string) => (
              <Space>
                <code className="bg-gray-100 px-2 py-1 rounded">{key.substring(0, 20)}...</code>
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(key)
                    message.success('API key copied to clipboard')
                  }}
                />
              </Space>
            ),
          },
          {
            title: 'Last Used',
            dataIndex: 'lastUsed',
            key: 'lastUsed',
            render: (date: string) => date ? new Date(date).toLocaleString() : 'Never',
          },
          {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: () => (
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => message.success('API key deleted')}>
                Delete
              </Button>
            ),
          },
        ]}
      />
    </div>
  )

  const AuditLogsTab = (
    <div className="space-y-4">
      <p className="text-gray-600">Track all system activities and changes</p>
      <Table
        dataSource={mockAuditLogs}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        columns={[
          {
            title: 'Timestamp',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          },
          {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            render: (name: string) => <span className="font-medium">{name}</span>,
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => <Tag color="blue">{action.toUpperCase()}</Tag>,
          },
          {
            title: 'Resource',
            dataIndex: 'resource',
            key: 'resource',
            render: (resource: string) => <Tag>{resource}</Tag>,
          },
          {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
          },
        ]}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your organization settings</p>
      </div>

      <Tabs
        defaultActiveKey="organization"
        items={[
          {
            key: 'organization',
            label: (
              <span>
                <SettingOutlined /> Organization
              </span>
            ),
            children: OrganizationTab,
          },
          {
            key: 'api-keys',
            label: (
              <span>
                <ApiOutlined /> API Keys
              </span>
            ),
            children: APIKeysTab,
          },
          {
            key: 'audit-logs',
            label: (
              <span>
                <AuditOutlined /> Audit Logs
              </span>
            ),
            children: AuditLogsTab,
          },
        ]}
      />
    </div>
  )
}
