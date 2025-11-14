import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons'
import { useCategoryStore } from '@/store/categoryStore'
import { Category } from '@/types'

export default function CategoriesPage() {
  const { getCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const categories = getCategories()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingCategory) {
        updateCategory(editingCategory.id, {
          ...values,
          keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
        })
        message.success('Category updated successfully')
      } else {
        const newCategory: Category = {
          id: Date.now().toString(),
          ...values,
          keywords: values.keywords ? values.keywords.split(',').map((k: string) => k.trim()) : [],
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        }
        addCategory(newCategory)
        message.success('Category created successfully')
      }
      setIsModalVisible(false)
      setEditingCategory(null)
      form.resetFields()
    } catch (error) {
      message.error('Please check all required fields')
    }
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteCategory(id)
        message.success('Category deleted successfully')
      },
    })
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <Space>
          <FolderOutlined style={{ color: record.color }} />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      render: (keywords: string[]) => (
        <Space wrap>
          {keywords.slice(0, 3).map((keyword) => (
            <Tag key={keyword} color="blue">{keyword}</Tag>
          ))}
          {keywords.length > 3 && <Tag>+{keywords.length - 3} more</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record)
              form.setFieldsValue({
                ...record,
                keywords: record.keywords?.join(', ') || '',
              })
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">Manage invoice categories</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Add Category
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={categories} rowKey="id" />
      </Card>

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingCategory(null)
          form.resetFields()
        }}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="accountCode" label="Account Code">
            <Input placeholder="e.g., 6100" />
          </Form.Item>
          <Form.Item name="keywords" label="Keywords">
            <Input placeholder="Comma-separated keywords" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
