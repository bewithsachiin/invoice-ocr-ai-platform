import { useState } from 'react'
import { Card, Table, Button, Space, Input, Select, DatePicker, Modal, Descriptions, Upload, message } from 'antd'
import { SearchOutlined, UploadOutlined, EyeOutlined, DownloadOutlined, CameraOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '@/components/common/StatusBadge'
import ConfidenceBadge from '@/components/common/ConfidenceBadge'
import { useInvoiceStore } from '@/store/invoiceStore'
import { Invoice } from '@/types'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { Dragger } = Upload

export default function ClientInvoicesPage() {
  const navigate = useNavigate()
  const { getInvoices } = useInvoiceStore()
  const invoices = getInvoices()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false)

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsModalVisible(true)
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*,.pdf',
    beforeUpload: () => false,
    onChange() {
      message.success('Invoice uploaded successfully!')
      setIsUploadModalVisible(false)
    },
  }

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-medium text-green-600">
          ${amount.toLocaleString()}
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
      render: (record: Invoice) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => message.success('Downloading invoice...')}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: '200px' }}>
          <h1 className="text-3xl font-bold">My Invoices</h1>
          <p className="text-gray-500 mt-1">View and manage your invoices</p>
        </div>
        <Space wrap style={{ flexShrink: 0 }}>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setIsUploadModalVisible(true)}
          >
            Upload
          </Button>
          <Button
            type="primary"
            icon={<CameraOutlined />}
            onClick={() => navigate('/client/upload/camera')}
          >
            Camera Upload
          </Button>
        </Space>
      </div>

      <Card>
        <Space direction="vertical" className="w-full" size="middle">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Input
              placeholder="Search invoices..."
              prefix={<SearchOutlined />}
              style={{ minWidth: 250, maxWidth: 300, flex: '1 1 250px' }}
              allowClear
            />
            <Select
              placeholder="Filter by Status"
              style={{ minWidth: 150, width: 200 }}
              allowClear
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="processing">Processing</Option>
            </Select>
            <RangePicker style={{ minWidth: 200 }} />
          </div>

          <Table
            columns={columns}
            dataSource={invoices}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} invoices`,
            }}
          />
        </Space>
      </Card>

      <Modal
        title="Invoice Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => message.success('Downloading invoice...')}
          >
            Download
          </Button>,
        ]}
      >
        {selectedInvoice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Invoice #" span={1}>
              {selectedInvoice.invoiceNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1}>
              <StatusBadge status={selectedInvoice.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Vendor" span={2}>
              {selectedInvoice.vendorName}
            </Descriptions.Item>
            <Descriptions.Item label="Invoice Date" span={1}>
              {dayjs(selectedInvoice.invoiceDate).format('MMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date" span={1}>
              {selectedInvoice.dueDate ? dayjs(selectedInvoice.dueDate).format('MMM DD, YYYY') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount" span={2}>
              <span className="text-xl font-bold text-green-600">
                ${selectedInvoice.totalAmount.toLocaleString()}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="OCR Confidence" span={2}>
              <ConfidenceBadge confidence={selectedInvoice.ocrConfidence} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Upload Invoice"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: '#1677ff' }} />
          </p>
          <p className="ant-upload-text">Click or drag file to upload</p>
          <p className="ant-upload-hint">
            Support for images (JPG, PNG) or PDF files
          </p>
        </Dragger>
      </Modal>
    </div>
  )
}
