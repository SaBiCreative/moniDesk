import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import useStore from './store/useStore'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import PriceCalculator from './pages/PriceCalculator'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Customers from './pages/Customers'
import Settings from './pages/Settings'
import './styles/app.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { settings } = useStore()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'price-calculator':
        return <PriceCalculator />
      case 'products':
        return <Products />
      case 'sales':
        return <Sales />
      case 'expenses':
        return <Expenses />
      case 'customers':
        return <Customers />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="app-main">
        <div className="page-header">
          <h1 className="page-title">{getPageTitle(currentPage)}</h1>
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="page-content">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

function getPageTitle(page) {
  const titles = {
    'dashboard': 'Dashboard',
    'price-calculator': 'Price Calculator',
    'products': 'Products',
    'sales': 'Sales',
    'expenses': 'Expenses',
    'customers': 'Customers',
    'settings': 'Settings',
  }
  return titles[page] || 'Dashboard'
}

export default App
