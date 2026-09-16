/**
 * Price Calculation Utilities
 * Nigerian Naira (₦) friendly calculations for business management
 */

/**
 * Calculate total cost of products
 * @param {number} costPrice - Cost price per unit
 * @param {number} quantity - Quantity of units
 * @returns {number} Total cost
 */
export const calculateTotalCost = (costPrice, quantity) => {
  if (!costPrice || !quantity) return 0
  return Math.round(costPrice * quantity * 100) / 100
}

/**
 * Calculate selling price based on markup percentage
 * @param {number} costPrice - Cost price per unit
 * @param {number} markupPercent - Markup percentage (e.g., 25 for 25%)
 * @returns {number} Selling price per unit
 */
export const calculateSellingPriceByMarkup = (costPrice, markupPercent) => {
  if (!costPrice || markupPercent === undefined) return 0
  const markup = costPrice * (markupPercent / 100)
  return Math.round((costPrice + markup) * 100) / 100
}

/**
 * Calculate selling price based on profit margin percentage
 * @param {number} costPrice - Cost price per unit
 * @param {number} marginPercent - Profit margin percentage (e.g., 20 for 20%)
 * @returns {number} Selling price per unit
 */
export const calculateSellingPriceByMargin = (costPrice, marginPercent) => {
  if (!costPrice || marginPercent === undefined) return 0
  if (marginPercent >= 100) return 0 // Invalid margin
  return Math.round((costPrice / (1 - marginPercent / 100)) * 100) / 100
}

/**
 * Calculate expected profit (profit per unit)
 * @param {number} costPrice - Cost price per unit
 * @param {number} sellingPrice - Selling price per unit
 * @param {number} quantity - Quantity sold
 * @returns {number} Total profit
 */
export const calculateExpectedProfit = (costPrice, sellingPrice, quantity = 1) => {
  if (!costPrice || !sellingPrice || !quantity) return 0
  const profitPerUnit = sellingPrice - costPrice
  return Math.round(profitPerUnit * quantity * 100) / 100
}

/**
 * Calculate profit margin percentage
 * @param {number} costPrice - Cost price per unit
 * @param {number} sellingPrice - Selling price per unit
 * @returns {number} Profit margin percentage
 */
export const calculateProfitMargin = (costPrice, sellingPrice) => {
  if (!sellingPrice || costPrice === undefined) return 0
  if (sellingPrice <= costPrice) return 0
  return Math.round(((sellingPrice - costPrice) / sellingPrice) * 10000) / 100
}

/**
 * Calculate markup percentage
 * @param {number} costPrice - Cost price per unit
 * @param {number} sellingPrice - Selling price per unit
 * @returns {number} Markup percentage
 */
export const calculateMarkupPercent = (costPrice, sellingPrice) => {
  if (!costPrice || costPrice === 0) return 0
  if (!sellingPrice) return 0
  return Math.round(((sellingPrice - costPrice) / costPrice) * 10000) / 100
}

/**
 * Calculate outstanding/payable amount
 * @param {number} totalSalesAmount - Total sales revenue
 * @param {number} amountPaid - Amount already paid
 * @returns {number} Outstanding payment
 */
export const calculateOutstandingPayment = (totalSalesAmount, amountPaid = 0) => {
  if (!totalSalesAmount) return 0
  const outstanding = totalSalesAmount - (amountPaid || 0)
  return Math.round(Math.max(0, outstanding) * 100) / 100
}

/**
 * Calculate net profit (total revenue minus total expenses)
 * @param {number} totalRevenue - Total sales revenue
 * @param {number} totalCost - Total cost of goods sold
 * @param {number} totalExpenses - Other business expenses
 * @returns {number} Net profit
 */
export const calculateNetProfit = (totalRevenue, totalCost, totalExpenses = 0) => {
  if (!totalRevenue) return 0
  const netProfit = totalRevenue - totalCost - (totalExpenses || 0)
  return Math.round(netProfit * 100) / 100
}

/**
 * Calculate gross profit (revenue minus cost of goods sold)
 * @param {number} totalRevenue - Total sales revenue
 * @param {number} totalCost - Total cost of goods sold
 * @returns {number} Gross profit
 */
export const calculateGrossProfit = (totalRevenue, totalCost) => {
  if (!totalRevenue) return 0
  const grossProfit = totalRevenue - totalCost
  return Math.round(grossProfit * 100) / 100
}

/**
 * Calculate profit margin percentage for overall business
 * @param {number} netProfit - Net profit
 * @param {number} totalRevenue - Total revenue
 * @returns {number} Profit margin percentage
 */
export const calculateProfitMarginPercent = (netProfit, totalRevenue) => {
  if (!totalRevenue || totalRevenue === 0) return 0
  return Math.round((netProfit / totalRevenue) * 10000) / 100
}

/**
 * Calculate ROI (Return on Investment)
 * @param {number} netProfit - Net profit
 * @param {number} investmentAmount - Initial investment/cost
 * @returns {number} ROI percentage
 */
export const calculateROI = (netProfit, investmentAmount) => {
  if (!investmentAmount || investmentAmount === 0) return 0
  return Math.round((netProfit / investmentAmount) * 10000) / 100
}

/**
 * Format currency to Nigerian Naira
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₦0.00'
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string (e.g., "₦1,000.00")
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') return 0
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''))
}

/**
 * Calculate break-even point (units needed to break even)
 * @param {number} fixedCosts - Total fixed costs
 * @param {number} unitPrice - Selling price per unit
 * @param {number} unitCost - Cost per unit
 * @returns {number} Break-even quantity
 */
export const calculateBreakEven = (fixedCosts, unitPrice, unitCost) => {
  if (!fixedCosts || !unitPrice || !unitCost) return 0
  const profitPerUnit = unitPrice - unitCost
  if (profitPerUnit <= 0) return 0
  return Math.ceil(fixedCosts / profitPerUnit)
}
