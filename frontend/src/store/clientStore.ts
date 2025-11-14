import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Client } from '@/types'
import { mockClients } from '@/utils/mockData'

interface ClientState {
  clients: Client[]
  getClients: () => Client[]
  getClientById: (id: string) => Client | undefined
  addClient: (client: Client) => void
  updateClient: (id: string, data: Partial<Client>) => void
  deleteClient: (id: string) => void
  toggleEmailMonitoring: (id: string) => void
  toggleWhatsAppMonitoring: (id: string) => void
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: mockClients,

      getClients: () => {
        return get().clients
      },

      getClientById: (id: string) => {
        return get().clients.find((client) => client.id === id)
      },

      addClient: (client: Client) => {
        set((state) => ({
          clients: [client, ...state.clients],
        }))
      },

      updateClient: (id: string, data: Partial<Client>) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...data } : client
          ),
        }))
      },

      deleteClient: (id: string) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }))
      },

      toggleEmailMonitoring: (id: string) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, emailMonitoringEnabled: !client.emailMonitoringEnabled }
              : client
          ),
        }))
      },

      toggleWhatsAppMonitoring: (id: string) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, whatsappMonitoringEnabled: !client.whatsappMonitoringEnabled }
              : client
          ),
        }))
      },
    }),
    {
      name: 'client-storage',
    }
  )
)
