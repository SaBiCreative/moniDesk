import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import useStore from '../store/useStore'
import { formatNaira, formatDate, toNumber, calculateSum } from '../utils/helpers'
import { calculateExpectedProfit, calculateProfitMargin } from '../utils/calculations'
import './Products.css'

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())
  const [errors, setErrors] = useState({})

  function getEmptyForm() {
    return {
      name: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      category: 'General',
    }
  }

  // Filter products by search term
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      newErrors.name = 'Product name is required'
    }
    const costPrice = toNumber(formData.costPrice)
    if (costPrice <= 0) {
      newErrors.costPrice = 'Cost price must be greater than 0'
    }
    const quantity = toNumber(formData.quantity)
    if (quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    const sellingPrice = toNumber(formData.sellingPrice)
    if (sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0'
    }
    if (sellingPrice <= costPrice) {
      newErrors.sellingPrice = 'Selling price must be greater than cost price'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddProduct = () => {
    if (!validateForm()) return

    const costPrice = toNumber(formData.costPrice)
    const sellingPrice = toNumber(formData.sellingPrice)
    const quantity = toNumber(formData.quantity)

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name.trim(),
        costPrice,
        sellingPrice,
        quantity,
        category: formData.category,
      })
      setEditingId(null)
    } else {
      addProduct({
        name: formData.name.trim(),
        costPrice,
        sellingPrice,
        quantity,
        category: formData.category,
      })
    }

    setFormData(getEmptyForm())
    setErrors({})
    setShowForm(false)
  }

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice || product.costPrice,
      quantity: product.quantity.toString(),
      category: product.category,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(getEmptyForm())
    setErrors({})
  }

  // Calculate totals
  const totalInventoryValue = calculateSum(products, 'costPrice')
  const totalProducts = products.length
  const totalUnits = calculateSum(products, 'quantity')

  return (
    <div className="products-page">
      {/* Header Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{totalProducts}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Units</div>
          <div className="stat-value">{totalUnits}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Inventory Value</div>
          <div className="stat-value">{formatNaira(totalInventoryValue, false)}</div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="products-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
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
          Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <div className="card-header">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <button className="close-btn" onClick={handleCloseForm}>
              <X size={24} />
            </button>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="General">General</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="costPrice">Cost Price (₦) *</label>
                <input
                  type="number"
                  id="costPrice"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.costPrice ? 'error' : ''}
                />
                {errors.costPrice && <span className="error-text">{errors.costPrice}</span>}
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
                <label htmlFor="quantity">Quantity in Stock *</label>
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
                onClick={handleAddProduct}
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h3>Products ({filteredProducts.length})</h3>
        </div>
        <div className="card-body">
          {filteredProducts.length > 0 ? (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Profit/Unit</th>
                    <th>Margin %</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const profit = calculateExpectedProfit(product.costPrice, product.sellingPrice || product.costPrice, 1)
                    const margin = calculateProfitMargin(product.costPrice, product.sellingPrice || product.costPrice)
                    return (
                      <tr key={product.id}>
                        <td className="product-name">
                          <strong>{product.name}</strong>
                        </td>
                        <td>
                          <span className="badge badge-info">{product.category}</span>
                        </td>
                        <td>{formatNaira(product.costPrice)}</td>
                        <td>{formatNaira(product.sellingPrice || product.costPrice)}</td>
                        <td className="positive-text">{formatNaira(profit)}</td>
                        <td>{margin.toFixed(2)}%</td>
                        <td>
                          <span className="stock-badge">{product.quantity}</span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditProduct(product)}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
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
              <p>No products found</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
