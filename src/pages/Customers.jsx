import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Mail, Phone } from 'lucide-react'
import useStore from '../store/useStore'
import { formatDate, toNumber } from '../utils/helpers'
import { isValidEmail, isValidPhone } from '../utils/helpers'
import './Customers.css'

const Customers = () => {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())
  const [errors, setErrors] = useState({})

  function getEmptyForm() {
    return {
      name: '',
      email: '',
      phone: '',
      businessName: '',
    }
  }

  // Filter customers by search term
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required'
    }
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCustomer = () => {
    if (!validateForm()) return

    if (editingId) {
      updateCustomer(editingId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
      })
      setEditingId(null)
    } else {
      addCustomer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
      })
    }

    setFormData(getEmptyForm())
    setErrors({})
    setShowForm(false)
  }

  const handleEditCustomer = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      businessName: customer.businessName,
    })
    setEditingId(customer.id)
    setShowForm(true)
  }

  const handleDeleteCustomer = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(getEmptyForm())
    setErrors({})
  }

  // Calculate customer sales
  const getCustomerSales = (customerId) => {
    return sales.filter(s => s.customer === customerId).length
  }

  return (
    <div className="customers-page">
      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="customers-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search customers by name or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <div className="card-header">
            <h3>{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
            <button className="close-btn" onClick={handleCloseForm}>
              <X size={24} />
            </button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Customer Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Nigerian phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddCustomer}
              >
                {editingId ? 'Update Customer' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers Grid/Table */}
      <div className="card">
        <div className="card-header">
          <h3>Customers ({filteredCustomers.length})</h3>
        </div>
        <div className="card-body">
          {filteredCustomers.length > 0 ? (
            <div className="customers-grid">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className="customer-card">
                  <div className="customer-header">
                    <h4>{customer.name}</h4>
                    <div className="customer-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditCustomer(customer)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {customer.businessName && (
                    <div className="customer-business">{customer.businessName}</div>
                  )}

                  <div className="customer-contacts">
                    {customer.email && (
                      <div className="contact-item">
                        <Mail size={16} />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="contact-item">
                        <Phone size={16} />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="customer-meta">
                    <span className="meta-item">Sales: {getCustomerSales(customer.id)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No customers found</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Add Your First Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Customers
