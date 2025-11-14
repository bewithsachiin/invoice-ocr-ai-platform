import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, Form, Input, Button, message, Upload, Tabs, Space } from 'antd'
import { UploadOutlined, CameraOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import CameraCapture from '@/components/common/CameraCapture'
import { mockClients } from '@/utils/mockData'

const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

export default function InvoiceCameraPage() {
  const navigate = useNavigate()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('camera')

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc)
    message.success('Photo captured successfully!')
  }

  const handleSubmit = async () => {
    setUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      message.success('Invoice uploaded successfully! OCR processing started.')
      navigate('/admin/invoices')
    } catch (error) {
      message.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*,.pdf',
    beforeUpload: () => false, // Prevent auto upload
    onChange(info: any) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/invoices')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Upload Invoice</h1>
          <p className="text-gray-500 mt-1">Capture or upload invoice for OCR processing</p>
        </div>
      </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'camera',
              label: (
                <span>
                  <CameraOutlined /> Camera Capture
                </span>
              ),
              children: (
                <div className="py-4">
                  {!capturedImage ? (
                    <CameraCapture onCapture={handleCapture} />
                  ) : (
                    <div className="text-center">
                      <img
                        src={capturedImage}
                        alt="Captured Invoice"
                        className="max-w-full mx-auto rounded-lg shadow-lg mb-4"
                        style={{ maxHeight: '400px' }}
                      />
                      <Button onClick={() => setCapturedImage(null)}>
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'upload',
              label: (
                <span>
                  <UploadOutlined /> File Upload
                </span>
              ),
              children: (
                <div className="py-4">
                  <Dragger {...uploadProps} style={{ padding: '40px' }}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for single file upload. Accepts images (JPG, PNG) or PDF files.
                    </p>
                  </Dragger>
                </div>
              ),
            },
          ]}
        />

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            label="Select Client"
            name="clientId"
            rules={[{ required: true, message: 'Please select a client' }]}
          >
            <Select
              size="large"
              placeholder="Choose client for this invoice"
              showSearch
              optionFilterProp="children"
            >
              {mockClients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Notes (Optional)"
            name="notes"
          >
            <TextArea
              rows={3}
              placeholder="Add any additional notes or context for this invoice..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={uploading}
                disabled={!capturedImage && activeTab === 'camera'}
              >
                Upload & Process Invoice
              </Button>
              <Button size="large" onClick={() => navigate('/admin/invoices')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
