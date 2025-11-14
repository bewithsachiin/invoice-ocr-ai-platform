import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Invoice } from '@/types'
import { mockInvoices } from '@/utils/mockData'

interface InvoiceState {
  invoices: Invoice[]
  getInvoices: () => Invoice[]
  getInvoiceById: (id: string) => Invoice | undefined
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  approveInvoice: (id: string) => void
  rejectInvoice: (id: string) => void
  bulkUpdateStatus: (ids: string[], status: 'approved' | 'rejected') => void
  bulkDelete: (ids: string[]) => void
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: mockInvoices,

      getInvoices: () => {
        return get().invoices
      },

      getInvoiceById: (id: string) => {
        return get().invoices.find((invoice) => invoice.id === id)
      },

      addInvoice: (invoice: Invoice) => {
        set((state) => ({
          invoices: [invoice, ...state.invoices],
        }))
      },

      updateInvoice: (id: string, data: Partial<Invoice>) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...data } : invoice
          ),
        }))
      },

      deleteInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }))
      },

      approveInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: 'approved' } : invoice
          ),
        }))
      },

      rejectInvoice: (id: string) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: 'rejected' } : invoice
          ),
        }))
      },

      bulkUpdateStatus: (ids: string[], status: 'approved' | 'rejected') => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            ids.includes(invoice.id) ? { ...invoice, status } : invoice
          ),
        }))
      },

      bulkDelete: (ids: string[]) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => !ids.includes(invoice.id)),
        }))
      },
    }),
    {
      name: 'invoice-storage',
    }
  )
)
