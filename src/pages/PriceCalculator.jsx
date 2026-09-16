import React, { useState } from 'react'
import { Plus, Save, AlertCircle, Check } from 'lucide-react'
import useStore from '../store/useStore'
import {
  calculateTotalCost,
  calculateSellingPriceByMarkup,
  calculateSellingPriceByMargin,
  calculateExpectedProfit,
  calculateProfitMargin,
  calculateMarkupPercent,
} from '../utils/calculations'
import { formatNaira, toNumber, capitalizeFirst } from '../utils/helpers'
import './PriceCalculator.css'

const PriceCalculator = () => {
  const { addProduct, settings } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    materialCost: '',
    labourCost: '',
    transportCost: '',
    otherCosts: '',
    percentage: settings.defaultMarkupPercent || 25,
    calculationType: 'markup', // 'markup' or 'margin'
    category: 'General',
  })

  const [savedMessage, setSavedMessage] = useState('')
  const [errors, setErrors] = useState({})

  // Calculate totals
  const materialCost = toNumber(formData.materialCost)
  const labourCost = toNumber(formData.labourCost)
  const transportCost = toNumber(formData.transportCost)
  const otherCosts = toNumber(formData.otherCosts)
  const percentage = toNumber(formData.percentage)

  const totalCost = calculateTotalCost(
    materialCost + labourCost + transportCost + otherCosts,
    1
  )

  const sellingPrice =
    formData.calculationType === 'markup'
      ? calculateSellingPriceByMarkup(totalCost, percentage)
      : calculateSellingPriceByMargin(totalCost, percentage)

  const expectedProfit = calculateExpectedProfit(totalCost, sellingPrice, 1)
  const profitMarginPercent = calculateProfitMargin(totalCost, sellingPrice)
  const markupPercent = calculateMarkupPercent(totalCost, sellingPrice)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors for this field
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
    if (totalCost <= 0) {
      newErrors.cost = 'At least one cost field must be greater than 0'
    }
    if (percentage < 0 || percentage > 999) {
      newErrors.percentage = 'Percentage must be between 0 and 999'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProduct = () => {
    if (!validateForm()) return

    addProduct({
      name: formData.name.trim(),
      costPrice: totalCost,
      quantity: 1,
      category: formData.category,
      sellingPrice: sellingPrice,
      markupPercent: markupPercent,
      profitMarginPercent: profitMarginPercent,
    })

    setSavedMessage('Product saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)

    // Reset form
    setFormData({
      name: '',
      materialCost: '',
      labourCost: '',
      transportCost: '',
      otherCosts: '',
      percentage: settings.defaultMarkupPercent || 25,
      calculationType: 'markup',
      category: 'General',
    })
    setErrors({})
  }

  return (
    <div className="price-calculator">
      {savedMessage && (
        <div className="alert alert-success">
          <Check size={20} />
          {savedMessage}
        </div>
      )}

      <div className="calculator-grid">
        {/* Input Section */}
        <div className="card calculator-card">
          <div className="card-header">
            <h3>Calculate Selling Price</h3>
          </div>
          <div className="card-body">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product/Service Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Office Chair, Consulting Fee"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Category */}
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

            {/* Cost Breakdown */}
            <div className="cost-section">
              <h4 className="section-title">Cost Breakdown</h4>

              <div className="form-group">
                <label htmlFor="materialCost">
                  Material Cost
                  <span className="cost-amount">{formatNaira(materialCost)}</span>
                </label>
                <input
                  type="number"
                  id="materialCost"
                  name="materialCost"
                  value={formData.materialCost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="labourCost">
                  Labour/Service Cost
                  <span className="cost-amount">{formatNaira(labourCost)}</span>
                </label>
                <input
                  type="number"
                  id="labourCost"
                  name="labourCost"
                  value={formData.labourCost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="transportCost">
                  Transport/Delivery Cost
                  <span className="cost-amount">{formatNaira(transportCost)}</span>
                </label>
                <input
                  type="number"
                  id="transportCost"
                  name="transportCost"
                  value={formData.transportCost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="otherCosts">
                  Other Costs
                  <span className="cost-amount">{formatNaira(otherCosts)}</span>
                </label>
                <input
                  type="number"
                  id="otherCosts"
                  name="otherCosts"
                  value={formData.otherCosts}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              {errors.cost && <span className="error-text">{errors.cost}</span>}
            </div>

            {/* Total Cost Display */}
            <div className="total-cost-box">
              <span className="label">Total Cost of Production</span>
              <span className="amount">{formatNaira(totalCost)}</span>
            </div>

            {/* Markup/Margin Selection */}
            <div className="calculation-mode">
              <h4 className="section-title">Profit Calculation</h4>
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${formData.calculationType === 'markup' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, calculationType: 'markup' }))}
                >
                  Markup %
                </button>
                <button
                  className={`mode-btn ${formData.calculationType === 'margin' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, calculationType: 'margin' }))}
                >
                  Profit Margin %
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="percentage">
                  {formData.calculationType === 'markup' ? 'Markup' : 'Profit Margin'} Percentage *
                  <span className="percentage-display">{percentage}%</span>
                </label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    id="percentage"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="0"
                    max="999"
                    step="0.1"
                    className={errors.percentage ? 'error' : ''}
                  />
                  <span className="suffix">%</span>
                </div>
                {errors.percentage && <span className="error-text">{errors.percentage}</span>}
                <div className="help-text">
                  {formData.calculationType === 'markup'
                    ? 'Markup is the profit added to cost price'
                    : 'Profit margin is the profit as a percentage of selling price'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {/* Selling Price Card */}
          <div className="card result-card selling-price-card">
            <div className="result-header">
              <span className="result-label">Recommended Selling Price</span>
            </div>
            <div className="result-value">{formatNaira(sellingPrice)}</div>
            <div className="result-meta">Per unit</div>
          </div>

          {/* Expected Profit Card */}
          <div className="card result-card expected-profit-card">
            <div className="result-header">
              <span className="result-label">Expected Profit</span>
            </div>
            <div className={`result-value ${expectedProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatNaira(expectedProfit)}
            </div>
            <div className="result-meta">Per unit sold</div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-label">Markup %</div>
              <div className="metric-value">{markupPercent.toFixed(2)}%</div>
              <div className="metric-desc">Cost-based markup</div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Profit Margin %</div>
              <div className="metric-value">{profitMarginPercent.toFixed(2)}%</div>
              <div className="metric-desc">Revenue-based margin</div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="card summary-card">
            <div className="summary-item">
              <span className="summary-label">Total Cost</span>
              <span className="summary-value">{formatNaira(totalCost)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Selling Price</span>
              <span className="summary-value">{formatNaira(sellingPrice)}</span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Profit Per Unit</span>
              <span className="summary-value">{formatNaira(expectedProfit)}</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            className="btn btn-primary btn-lg save-btn"
            onClick={handleSaveProduct}
          >
            <Save size={20} />
            Save as Product
          </button>

          {/* Info Box */}
          <div className="info-box">
            <AlertCircle size={18} />
            <div>
              <strong>Quick Help:</strong>
              <p>Enter your costs and choose between markup % or profit margin %. The calculator will automatically compute your recommended selling price and expected profit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceCalculator
