import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Products State
  products: [
    { id: 1, name: 'Laptop', costPrice: 250000, quantity: 5, category: 'Electronics' },
    { id: 2, name: 'Mouse', costPrice: 3000, quantity: 50, category: 'Accessories' },
    { id: 3, name: 'Keyboard', costPrice: 15000, quantity: 30, category: 'Accessories' },
  ],
  
  addProduct: (product) => set(state => ({
    products: [...state.products, { ...product, id: Date.now() }]
  })),
  
  updateProduct: (id, updates) => set(state => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  deleteProduct: (id) => set(state => ({
    products: state.products.filter(p => p.id !== id)
  })),
  
  // Sales State
  sales: [
    { id: 1, productId: 1, sellingPrice: 350000, quantity: 2, totalAmount: 700000, date: '2024-09-15', customer: 'John Doe' },
    { id: 2, productId: 2, sellingPrice: 5000, quantity: 10, totalAmount: 50000, date: '2024-09-14', customer: 'Jane Smith' },
  ],
  
  addSale: (sale) => set(state => ({
    sales: [...state.sales, { ...sale, id: Date.now() }]
  })),
  
  updateSale: (id, updates) => set(state => ({
    sales: state.sales.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  
  deleteSale: (id) => set(state => ({
    sales: state.sales.filter(s => s.id !== id)
  })),
  
  // Expenses State
  expenses: [
    { id: 1, category: 'Rent', amount: 100000, date: '2024-09-01', description: 'Office rent' },
    { id: 2, category: 'Utilities', amount: 25000, date: '2024-09-10', description: 'Electricity bill' },
  ],
  
  addExpense: (expense) => set(state => ({
    expenses: [...state.expenses, { ...expense, id: Date.now() }]
  })),
  
  updateExpense: (id, updates) => set(state => ({
    expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  
  deleteExpense: (id) => set(state => ({
    expenses: state.expenses.filter(e => e.id !== id)
  })),
  
  // Customers State
  customers: [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '08012345678', totalPurchases: 700000, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '08087654321', totalPurchases: 50000, status: 'Active' },
  ],
  
  addCustomer: (customer) => set(state => ({
    customers: [...state.customers, { ...customer, id: Date.now() }]
  })),
  
  updateCustomer: (id, updates) => set(state => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  deleteCustomer: (id) => set(state => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
  
  // Settings State
  settings: {
    businessName: 'My Business',
    currency: '₦',
    taxRate: 7.5,
    defaultMarkupPercent: 25,
    theme: 'light',
  },
  
  updateSettings: (updates) => set(state => ({
    settings: { ...state.settings, ...updates }
  })),
  
  // Helper function to calculate profit
  calculateProfit: (costPrice, sellingPrice, quantity = 1) => {
    return (sellingPrice - costPrice) * quantity
  },
  
  // Helper function to calculate markup
  calculateMarkup: (costPrice, sellingPrice) => {
    if (costPrice === 0) return 0
    return ((sellingPrice - costPrice) / costPrice) * 100
  },
  
  // Helper function to calculate profit margin
  calculateMargin: (costPrice, sellingPrice) => {
    if (sellingPrice === 0) return 0
    return ((sellingPrice - costPrice) / sellingPrice) * 100
  },
  
  // Helper function to calculate selling price from cost and markup
  calculateSellingPrice: (costPrice, markupPercent) => {
    return costPrice * (1 + markupPercent / 100)
  },
}))

export default useStore
