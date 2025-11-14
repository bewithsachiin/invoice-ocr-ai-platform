export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'client' | 'user'
  organizationId: string
  avatar?: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  logo?: string
  settings: OrganizationSettings
  createdAt: string
}

export interface OrganizationSettings {
  ocrConfidenceThreshold: number
  defaultLanguage: string
  emailNotifications: boolean
  whatsappNotifications: boolean
  autoApproveHighConfidence: boolean
}

export interface Invoice {
  id: string
  invoiceNumber: string
  vendorName: string
  vendorEmail?: string
  vendorPhone?: string
  vendorAddress?: string
  invoiceDate: string
  dueDate?: string
  totalAmount: number
  currency: string
  taxAmount?: number
  subtotal?: number
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  ocrConfidence: number
  clientId?: string
  clientName?: string
  categoryId?: string
  categoryName?: string
  items: InvoiceItem[]
  fileUrl: string
  fileName: string
  fileType: string
  notes?: string
  extractedData?: Record<string, any>
  createdAt: string
  updatedAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  companyName?: string
  address?: string
  organizationId: string
  emailMonitoringEnabled: boolean
  whatsappMonitoringEnabled: boolean
  invoiceCount: number
  totalSpent: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  keywords: string[]
  accountCode?: string
  parentId?: string
  color?: string
  icon?: string
  organizationId: string
  createdAt: string
}

export interface EmailIntegration {
  id: string
  provider: 'gmail' | 'outlook' | 'imap'
  email: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  settings: {
    imapHost?: string
    imapPort?: number
    smtpHost?: string
    smtpPort?: number
    useSSL?: boolean
  }
  organizationId: string
  createdAt: string
}

export interface WhatsAppIntegration {
  id: string
  phoneNumber?: string
  status: 'connected' | 'disconnected' | 'qr_pending'
  qrCode?: string
  lastSync?: string
  organizationId: string
  createdAt: string
}

export interface AccountingIntegration {
  id: string
  provider: 'quickbooks' | 'xero' | 'custom'
  status: 'connected' | 'disconnected' | 'error'
  accessToken?: string
  refreshToken?: string
  lastSync?: string
  fieldMapping: Record<string, string>
  organizationId: string
  createdAt: string
}

export interface APIKey {
  id: string
  name: string
  key: string
  lastUsed?: string
  createdAt: string
  expiresAt?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  details?: Record<string, any>
  ipAddress?: string
  createdAt: string
}

export interface DashboardStats {
  totalInvoices: number
  pendingInvoices: number
  approvedInvoices: number
  rejectedInvoices: number
  totalAmount: number
  monthlyAmount: number
  clientCount: number
  averageProcessingTime: number
  averageOCRConfidence: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface FilterOptions {
  status?: string[]
  dateRange?: [string, string]
  clientId?: string
  categoryId?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}
