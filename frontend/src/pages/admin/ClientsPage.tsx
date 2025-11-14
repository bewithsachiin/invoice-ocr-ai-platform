import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Space, Input, Tag, Modal, Form, message, Switch } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MailOutlined, EyeOutlined } from '@ant-design/icons'
import { useClientStore } from '@/store/clientStore'
import { Client } from '@/types'

export default function ClientsPage() {
  const navigate = useNavigate()
  const { getClients, addClient, updateClient, deleteClient, toggleEmailMonitoring } = useClientStore()
  const clients = getClients()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form] = Form.useForm()

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingClient) {
        updateClient(editingClient.id, values)
        message.success('Client updated successfully')
      } else {
        const newClient: Client = {
          id: Date.now().toString(),
          ...values,
          invoiceCount: 0,
          totalSpent: 0,
          status: 'active',
        }
        addClient(newClient)
        message.success('Client created successfully')
      }
      setIsModalVisible(false)
      setEditingClient(null)
      form.resetFields()
    } catch (error) {
      message.error('Please check all required fields')
    }
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Client',
      content: 'Are you sure you want to delete this client?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteClient(id)
        message.success('Client deleted successfully')
      },
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Client) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/clients/${record.id}`)}
          className="font-medium text-blue-600 hover:text-blue-700 p-0"
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Invoices',
      dataIndex: 'invoiceCount',
      key: 'invoiceCount',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount: number) => (
        <span className="font-medium text-green-600">${amount.toLocaleString()}</span>
      ),
    },
    {
      title: 'Email Monitoring',
      dataIndex: 'emailMonitoringEnabled',
      key: 'emailMonitoringEnabled',
      render: (enabled: boolean, record: Client) => (
        <Switch
          checked={enabled}
          onChange={() => {
            toggleEmailMonitoring(record.id)
            message.success(`Email monitoring ${!enabled ? 'enabled' : 'disabled'}`)
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Client) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/clients/${record.id}`)}
            className="text-blue-600 hover:text-blue-700"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingClient(record)
              form.setFieldsValue(record)
              setIsModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="enterprise-page-content">
      <div className="enterprise-page-header flex justify-between items-start">
        <div>
          <h1 className="enterprise-page-title">Clients</h1>
          <p className="enterprise-page-subtitle">Manage your clients</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClient(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
          className="enterprise-btn-primary"
          size="large"
        >
          Add Client
        </Button>
      </div>

      <Card className="enterprise-table-card" bordered={false}>
        <Space direction="vertical" className="w-full" size="middle">
          <Input
            placeholder="Search clients..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            size="large"
            allowClear
          />
          <Table
            columns={columns}
            dataSource={clients}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="enterprise-table"
          />
        </Space>
      </Card>

      <Modal
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingClient(null)
          form.resetFields()
        }}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item name="companyName" label="Company Name">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="emailMonitoringEnabled" label="Email Monitoring" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="whatsappMonitoringEnabled" label="WhatsApp Monitoring" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
