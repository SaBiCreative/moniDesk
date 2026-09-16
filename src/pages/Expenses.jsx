import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import useStore from '../store/useStore'
import { formatNaira, formatDate, toNumber, calculateSum } from '../utils/helpers'
import './Expenses.css'

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())
  const [errors, setErrors] = useState({})

  const categories = ['Rent', 'Utilities', 'Salaries', 'Transport', 'Marketing', 'Supplies', 'Other']

  function getEmptyForm() {
    return {
      category: 'Other',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  }

  // Filter expenses by search term
  const filteredExpenses = expenses.filter(e =>
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    const amount = toNumber(formData.amount)
    if (amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddExpense = () => {
    if (!validateForm()) return

    if (editingId) {
      updateExpense(editingId, {
        category: formData.category,
        amount: toNumber(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
      })
      setEditingId(null)
    } else {
      addExpense({
        category: formData.category,
        amount: toNumber(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
      })
    }

    setFormData(getEmptyForm())
    setErrors({})
    setShowForm(false)
  }

  const handleEditExpense = (expense) => {
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date,
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDeleteExpense = (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(getEmptyForm())
    setErrors({})
  }

  // Calculate totals by category
  const expensesByCategory = categories.reduce((acc, cat) => {
    const total = calculateSum(
      expenses.filter(e => e.category === cat),
      'amount'
    )
    if (total > 0) {
      acc.push({ category: cat, total })
    }
    return acc
  }, [])

  const totalExpenses = calculateSum(expenses, 'amount')

  return (
    <div className="expenses-page">
      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{formatNaira(totalExpenses, false)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
      </div>

      {/* Expenses by Category */}
      {expensesByCategory.length > 0 && (
        <div className="categories-grid">
          {expensesByCategory.map(cat => (
            <div key={cat.category} className="category-card">
              <div className="category-label">{cat.category}</div>
              <div className="category-amount">{formatNaira(cat.total)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search and Add Button */}
      <div className="expenses-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search expenses by category or description..."
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
          Add Expense
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <div className="card-header">
            <h3>{editingId ? 'Edit Expense' : 'Record New Expense'}</h3>
            <button className="close-btn" onClick={handleCloseForm}>
              <X size={24} />
            </button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₦) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
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
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter expense details"
                  rows="3"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
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
                onClick={handleAddExpense}
              >
                {editingId ? 'Update Expense' : 'Record Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="card">
        <div className="card-header">
          <h3>Expense Records ({filteredExpenses.length})</h3>
        </div>
        <div className="card-body">
          {filteredExpenses.length > 0 ? (
            <div className="expenses-table-wrapper">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{formatDate(expense.date)}</td>
                      <td>
                        <span className="category-badge">{expense.category}</span>
                      </td>
                      <td>{expense.description}</td>
                      <td className="amount">{formatNaira(expense.amount)}</td>
                      <td className="actions-cell">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditExpense(expense)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No expenses recorded yet</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Record Your First Expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Expenses
