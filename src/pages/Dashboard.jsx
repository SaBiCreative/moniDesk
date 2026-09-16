import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'
import { calculateSum, formatNaira, formatDate, sortByKey } from '../utils/helpers'
import { calculateNetProfit, calculateGrossProfit } from '../utils/calculations'
import './Dashboard.css'

const Dashboard = () => {
  const { products, sales, expenses, customers } = useStore()

  // Calculate metrics
  const totalRevenue = calculateSum(sales, 'totalAmount')
  const totalExpenses = calculateSum(expenses, 'amount')
  const totalCostOfGoods = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0)
  const grossProfit = calculateGrossProfit(totalRevenue, totalCostOfGoods)
  const netProfit = calculateNetProfit(totalRevenue, totalCostOfGoods, totalExpenses)
  const totalSales = sales.length
  const outstandingPayment = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) // Simplified
  const totalCustomers = customers.length

  // Get recent transactions (last 5)
  const recentTransactions = [
    ...sales.map(s => ({
      id: s.id,
      type: 'sale',
      description: `Sale: ${s.quantity}x items`,
      amount: s.totalAmount,
      date: s.date,
      customer: s.customer
    })),
    ...expenses.map(e => ({
      id: e.id,
      type: 'expense',
      description: `Expense: ${e.category} - ${e.description}`,
      amount: -e.amount,
      date: e.date,
      category: e.category
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Get 7-day sales data
  const getLast7DaysSales = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const daySales = sales.filter(s => s.date.startsWith(dateStr))
      const dayTotal = calculateSum(daySales, 'totalAmount')
      days.push({
        date: date.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' }),
        amount: dayTotal,
        fullDate: dateStr
      })
    }
    return days
  }

  const salesTrend = getLast7DaysSales()
  const maxTrendAmount = Math.max(...salesTrend.map(d => d.amount), 1)

  return (
    <div className="dashboard">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-revenue">
          <div className="kpi-header">
            <h3 className="kpi-title">Total Revenue</h3>
            <div className="kpi-icon revenue-icon">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="kpi-value">{formatNaira(totalRevenue)}</div>
          <div className="kpi-meta">{totalSales} sales</div>
        </div>

        <div className="kpi-card kpi-profit">
          <div className="kpi-header">
            <h3 className="kpi-title">Gross Profit</h3>
            <div className="kpi-icon profit-icon">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="kpi-value">{formatNaira(grossProfit)}</div>
          <div className="kpi-meta">Before expenses</div>
        </div>

        <div className="kpi-card kpi-net-profit">
          <div className="kpi-header">
            <h3 className="kpi-title">Net Profit</h3>
            <div className="kpi-icon net-profit-icon">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className={`kpi-value ${netProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatNaira(netProfit)}
          </div>
          <div className="kpi-meta">After all expenses</div>
        </div>

        <div className="kpi-card kpi-expenses">
          <div className="kpi-header">
            <h3 className="kpi-title">Total Expenses</h3>
            <div className="kpi-icon expenses-icon">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="kpi-value">{formatNaira(totalExpenses)}</div>
          <div className="kpi-meta">{expenses.length} expenses</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-label">Total Customers</div>
          <div className="stat-number">{totalCustomers}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Products</div>
          <div className="stat-number">{products.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Outstanding</div>
          <div className="stat-number">{formatNaira(outstandingPayment, false)}</div>
        </div>
      </div>

      {/* Charts and Transactions */}
      <div className="dashboard-grid">
        {/* Sales Trend */}
        <div className="card">
          <div className="card-header">
            <h3>7-Day Sales Trend</h3>
          </div>
          <div className="card-body">
            <div className="sales-trend">
              {salesTrend.map((day, idx) => {
                const height = maxTrendAmount > 0 ? (day.amount / maxTrendAmount) * 100 : 0
                return (
                  <div key={idx} className="trend-bar-container">
                    <div className="trend-bar-wrapper">
                      <div
                        className="trend-bar"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={formatNaira(day.amount)}
                      />
                    </div>
                    <div className="trend-label">{day.date}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <a href="#" className="view-all">View All</a>
          </div>
          <div className="card-body">
            {recentTransactions.length > 0 ? (
              <div className="transactions-list">
                {recentTransactions.map((transaction) => (
                  <div key={`${transaction.type}-${transaction.id}`} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-icon">
                        {transaction.type === 'sale' ? (
                          <ShoppingCart size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        )}
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-title">{transaction.description}</div>
                        <div className="transaction-meta">
                          {formatDate(transaction.date)} • {transaction.customer || transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type === 'sale' ? 'income' : 'expense'}`}>
                      {transaction.type === 'sale' ? '+' : '-'}{formatNaira(Math.abs(transaction.amount), false)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle size={40} />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
