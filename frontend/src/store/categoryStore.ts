import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Category } from '@/types'
import { mockCategories } from '@/utils/mockData'

interface CategoryState {
  categories: Category[]
  getCategories: () => Category[]
  getCategoryById: (id: string) => Category | undefined
  addCategory: (category: Category) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: mockCategories,

      getCategories: () => {
        return get().categories
      },

      getCategoryById: (id: string) => {
        return get().categories.find((category) => category.id === id)
      },

      addCategory: (category: Category) => {
        set((state) => ({
          categories: [category, ...state.categories],
        }))
      },

      updateCategory: (id: string, data: Partial<Category>) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...data } : category
          ),
        }))
      },

      deleteCategory: (id: string) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }))
      },
    }),
    {
      name: 'category-storage',
    }
  )
)
