/**
 * Helper Utility Functions
 * Reusable utilities for formatting, calculations, and data manipulation
 */

/**
 * Format number as Nigerian Naira currency
 * @param {number} amount - Amount to format
 * @param {boolean} includeSymbol - Whether to include the ₦ symbol
 * @returns {string} Formatted currency string
 */
export const formatNaira = (amount, includeSymbol = true) => {
  if (typeof amount !== 'number' || isNaN(amount)) return includeSymbol ? '₦0.00' : '0.00'
  
  const formatted = amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return includeSymbol ? `₦${formatted}` : formatted
}

/**
 * Format date to readable string (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'iso'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-NG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      case 'iso':
        return dateObj.toISOString().split('T')[0]
      case 'short':
      default:
        return dateObj.toLocaleDateString('en-NG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
    }
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Format time to HH:MM format
 * @param {string|Date} date - Date/time to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  if (!date) return '--:--'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch (error) {
    return '--:--'
  }
}

/**
 * Format date and time together
 * @param {string|Date} date - Date/time to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return `${formatDate(date, 'short')} ${formatTime(date)}`
}

/**
 * Generate unique ID (timestamp + random string)
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate UUID v4 format
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Safely convert value to number
 * @param {any} value - Value to convert
 * @param {number} defaultValue - Default value if conversion fails
 * @returns {number} Converted number
 */
export const toNumber = (value, defaultValue = 0) => {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Safely convert value to string
 * @param {any} value - Value to convert
 * @param {string} defaultValue - Default value if conversion fails
 * @returns {string} Converted string
 */
export const toString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue
  return String(value)
}

/**
 * Safely convert value to boolean
 * @param {any} value - Value to convert
 * @returns {boolean} Converted boolean
 */
export const toBoolean = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return Boolean(value)
}

/**
 * Calculate sum of array values
 * @param {Array} arr - Array of numbers or objects
 * @param {string} key - Key to sum (for objects)
 * @returns {number} Sum of values
 */
export const calculateSum = (arr, key = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  
  return arr.reduce((sum, item) => {
    const value = key ? item[key] : item
    return sum + toNumber(value, 0)
  }, 0)
}

/**
 * Calculate average of array values
 * @param {Array} arr - Array of numbers or objects
 * @param {string} key - Key to average (for objects)
 * @returns {number} Average value
 */
export const calculateAverage = (arr, key = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  const sum = calculateSum(arr, key)
  return Math.round((sum / arr.length) * 100) / 100
}

/**
 * Find max value in array
 * @param {Array} arr - Array of numbers or objects
 * @param {string} key - Key to find max (for objects)
 * @returns {number} Maximum value
 */
export const findMax = (arr, key = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  return Math.max(...arr.map(item => toNumber(key ? item[key] : item, 0)))
}

/**
 * Find min value in array
 * @param {Array} arr - Array of numbers or objects
 * @param {string} key - Key to find min (for objects)
 * @returns {number} Minimum value
 */
export const findMin = (arr, key = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return 0
  return Math.min(...arr.map(item => toNumber(key ? item[key] : item, 0)))
}

/**
 * Filter array by date range
 * @param {Array} arr - Array of objects with date property
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} dateKey - Key name for date field
 * @returns {Array} Filtered array
 */
export const filterByDateRange = (arr, startDate, endDate, dateKey = 'date') => {
  if (!Array.isArray(arr)) return []
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  return arr.filter(item => {
    const itemDate = new Date(item[dateKey])
    return itemDate >= start && itemDate <= end
  })
}

/**
 * Sort array of objects by property
 * @param {Array} arr - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByKey = (arr, key, order = 'asc') => {
  if (!Array.isArray(arr)) return []
  
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    return order === 'asc' ? aVal - bVal : bVal - aVal
  })
}

/**
 * Group array by key value
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupByKey = (arr, key) => {
  if (!Array.isArray(arr)) return {}
  
  return arr.reduce((groups, item) => {
    const groupKey = item[key]
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {})
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if phone number is valid (Nigerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+?234|0)[1-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text || text.length <= length) return text
  return text.slice(0, length) + suffix
}

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeFirst = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert to title case
 * @param {string} text - Text to convert
 * @returns {string} Title case text
 */
export const toTitleCase = (text) => {
  if (!text) return ''
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
