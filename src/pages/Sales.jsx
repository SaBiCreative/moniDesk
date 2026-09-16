import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, DollarSign, TrendingUp } from 'lucide-react'
import useStore from '../store/useStore'
import { formatNaira, formatDate, toNumber, calculateSum } from '../utils/helpers'
import { calculateExpectedProfit } from '../utils/calculations'
import './Sales.css'

const Sales = () => {
  const { sales, products, addSale, updateSale, deleteSale } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())
  const [errors, setErrors] = useState({})

  function getEmptyForm() {
    return {
      productId: '',
      quantity: '',
      sellingPrice: '',
      customer: '',
      amountPaid: '',
      paymentStatus: 'Unpaid',
      date: new Date().toISOString().split('T')[0],
      note: '',
    }
  }

  // Filter sales by search term
  const filteredSales = sales.filter(s =>
    s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.productId && s.productId.toString().includes(searchTerm))
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
    
    const quantity = toNumber(formData.quantity)
    if (quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    
    const sellingPrice = toNumber(formData.sellingPrice)
    if (sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0'
    }
    
    const amountPaid = toNumber(formData.amountPaid)
    const totalAmount = sellingPrice * quantity
    if (amountPaid < 0 || amountPaid > totalAmount) {
      newErrors.amountPaid = `Amount paid must be between 0 and ${formatNaira(totalAmount)}`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddSale = () => {
    if (!validateForm()) return

    const quantity = toNumber(formData.quantity)
    const sellingPrice = toNumber(formData.sellingPrice)
    const amountPaid = toNumber(formData.amountPaid)
    const totalAmount = sellingPrice * quantity

    if (editingId) {
      updateSale(editingId, {
        quantity,
        sellingPrice,
        customer: formData.customer.trim() || 'Walk-in Customer',
        amountPaid,
        paymentStatus: formData.paymentStatus,
        date: formData.date,
        note: formData.note.trim(),
        totalAmount,
      })
      setEditingId(null)
    } else {
      addSale({
        productId: toNumber(formData.productId),
        quantity,
        sellingPrice,
        customer: formData.customer.trim() || 'Walk-in Customer',
        amountPaid,
        paymentStatus: formData.paymentStatus,
        date: formData.date,
        note: formData.note.trim(),
        totalAmount,
      })
    }

    setFormData(getEmptyForm())
    setErrors({})
    setShowForm(false)
  }

  const handleEditSale = (sale) => {
    setFormData({
      productId: sale.productId.toString(),
      quantity: sale.quantity.toString(),
      sellingPrice: sale.sellingPrice.toString(),
      customer: sale.customer,
      amountPaid: sale.amountPaid ? sale.amountPaid.toString() : '',
      paymentStatus: sale.paymentStatus,
      date: sale.date,
      note: sale.note || '',
    })
    setEditingId(sale.id)
    setShowForm(true)
  }

  const handleDeleteSale = (id) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      deleteSale(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(getEmptyForm())
    setErrors({})
  }

  // Calculate totals
  const totalRevenue = calculateSum(sales, 'totalAmount')
  const totalProfit = sales.reduce((sum, sale) => {
    const costPrice = products.find(p => p.id === sale.productId)?.costPrice || 0
    const profit = calculateExpectedProfit(costPrice, sale.sellingPrice, sale.quantity)
    return sum + profit
  }, 0)
  const totalOutstanding = sales.reduce((sum, sale) => {
    const outstanding = Math.max(0, (sale.totalAmount || 0) - (sale.amountPaid || 0))
    return sum + outstanding
  }, 0)

  return (
    <div className="sales-page">
      {/* Header Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">{formatNaira(totalRevenue, false)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon profit">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Profit</div>
            <div className="stat-value positive">{formatNaira(totalProfit, false)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon outstanding">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Outstanding</div>
            <div className="stat-value warning">{formatNaira(totalOutstanding, false)}</div>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="sales-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search sales by customer or product..."
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
          Record Sale
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <div className="card-header">
            <h3>{editingId ? 'Edit Sale' : 'Record New Sale'}</h3>
            <button className="close-btn" onClick={handleCloseForm}>
              <X size={24} />
            </button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="productId">Product</label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatNaira(p.costPrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sellingPrice">Selling Price (₦) *</label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.sellingPrice ? 'error' : ''}
                />
                {errors.sellingPrice && <span className="error-text">{errors.sellingPrice}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="customer">Customer Name</label>
                <input
                  type="text"
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amountPaid">Amount Paid (₦)</label>
                <input
                  type="number"
                  id="amountPaid"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.amountPaid ? 'error' : ''}
                />
                {errors.amountPaid && <span className="error-text">{errors.amountPaid}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="paymentStatus">Payment Status</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                >
                  <option value="Paid">Paid</option>
                  <option value="Part-paid">Part-paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="note">Note</label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Add any notes about this sale"
                  rows="3"
                />
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
                onClick={handleAddSale}
              >
                {editingId ? 'Update Sale' : 'Record Sale'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="card">
        <div className="card-header">
          <h3>Sales Transactions ({filteredSales.length})</h3>
        </div>
        <div className="card-body">
          {filteredSales.length > 0 ? (
            <div className="sales-table-wrapper">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Amount</th>
                    <th>Amount Paid</th>
                    <th>Outstanding</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map(sale => {
                    const outstanding = Math.max(0, (sale.totalAmount || 0) - (sale.amountPaid || 0))
                    return (
                      <tr key={sale.id}>
                        <td>{formatDate(sale.date)}</td>
                        <td className="customer-name">{sale.customer}</td>
                        <td>{sale.quantity}</td>
                        <td>{formatNaira(sale.sellingPrice)}</td>
                        <td className="amount">{formatNaira(sale.totalAmount || 0)}</td>
                        <td className="paid">{formatNaira(sale.amountPaid || 0)}</td>
                        <td className={outstanding > 0 ? 'outstanding' : ''}>
                          {formatNaira(outstanding)}
                        </td>
                        <td>
                          <span className={`badge badge-${sale.paymentStatus.toLowerCase().replace('-', '')}`}>
                            {sale.paymentStatus}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditSale(sale)}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteSale(sale.id)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No sales recorded yet</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Record Your First Sale
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sales
