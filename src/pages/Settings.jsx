import React, { useState } from 'react'
import { Save, Check } from 'lucide-react'
import useStore from '../store/useStore'
import './Settings.css'

const Settings = () => {
  const { settings, updateSettings } = useStore()
  const [formData, setFormData] = useState({
    businessName: settings.businessName || '',
    businessPhone: settings.businessPhone || '',
    businessEmail: settings.businessEmail || '',
    defaultMarkupPercent: settings.defaultMarkupPercent || 25,
    currency: settings.currency || 'NGN',
  })
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultMarkupPercent' ? parseFloat(value) : value
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
    if (formData.defaultMarkupPercent < 0 || formData.defaultMarkupPercent > 999) {
      newErrors.defaultMarkupPercent = 'Markup must be between 0 and 999'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveSettings = () => {
    if (!validateForm()) return

    updateSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="settings-page">
      {saved && (
        <div className="alert alert-success">
          <Check size={20} />
          Settings saved successfully!
        </div>
      )}

      <div className="settings-container">
        {/* Business Information Section */}
        <div className="card settings-card">
          <div className="card-header">
            <h3>Business Information</h3>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessPhone">Business Phone</label>
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  placeholder="Enter your business phone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessEmail">Business Email</label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your business email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Defaults Section */}
        <div className="card settings-card">
          <div className="card-header">
            <h3>Pricing & Defaults</h3>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="defaultMarkupPercent">
                  Default Markup Percentage (%)
                </label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    id="defaultMarkupPercent"
                    name="defaultMarkupPercent"
                    value={formData.defaultMarkupPercent}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="0"
                    max="999"
                    step="0.1"
                    className={errors.defaultMarkupPercent ? 'error' : ''}
                  />
                  <span className="suffix">%</span>
                </div>
                {errors.defaultMarkupPercent && (
                  <span className="error-text">{errors.defaultMarkupPercent}</span>
                )}
                <span className="help-text">
                  This markup percentage will be used as default in the price calculator
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
                <span className="help-text">
                  Choose your preferred currency for the application
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSaveSettings}
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
