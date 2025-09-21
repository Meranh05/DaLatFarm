import React, { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Package, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { eventsAPI, statsAPI } from '../../services/apiService'
import * as XLSX from 'xlsx'

// Trang Thống kê & Phân tích: tổng quan, xu hướng, danh mục, top sản phẩm, lượt xem theo tháng
// Ghi chú: Hàm xuất CSV thêm BOM UTF-8 và tiêu đề tiếng Việt; XLSX nhiều sheet

const AdminAnalytics = () => {
  const { products } = useProducts()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [analyticsData, setAnalyticsData] = useState({})

  useEffect(() => {
    loadAnalytics()
  }, [timeRange, products])

  const getRange = (range, offset = 0) => {
    const now = new Date()
    if (range === 'week') {
      const day = now.getDay() || 7
      const monday = new Date(now)
      monday.setDate(now.getDate() - day + 1 + offset * 7)
      monday.setHours(0, 0, 0, 0)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 7)
      return [monday.getTime(), sunday.getTime()]
    }
    if (range === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3) + offset
      const start = new Date(now.getFullYear(), quarter * 3, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 1)
      return [start.getTime(), end.getTime()]
    }
    if (range === 'year') {
      const start = new Date(now.getFullYear() + offset, 0, 1)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now.getFullYear() + offset + 1, 0, 1)
      return [start.getTime(), end.getTime()]
    }
    // month default
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1)
    return [start.getTime(), end.getTime()]
  }

  const within = (ts, [start, end]) => {
    if (!ts) return false
    const t = Number(ts)
    return t >= start && t < end
  }

  const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0)

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Calculate products per range
      const currentRange = getRange(timeRange, 0)
      const prevRange = getRange(timeRange, -1)

      const totalViews = sum(products.map(p => p.views || 0))
      const totalProducts = products.length

      const currentProducts = products.filter(p => within(p.createdAt || 0, currentRange))
      const prevProducts = products.filter(p => within(p.createdAt || 0, prevRange))

      // Events by range (from Firestore)
      const events = await eventsAPI.getAll().catch(() => [])
      const totalEvents = events.length
      const currentEvents = events.filter(e => within(e.date || e.createdAt || 0, currentRange))
      const prevEvents = events.filter(e => within(e.date || e.createdAt || 0, prevRange))

      // Visits by day map
      const dailyMap = await statsAPI.getDailyMap().catch(() => ({}))
      const getDayStr = (d) => {
        const pad = (n) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      }
      const countVisitsInRange = ([startTs, endTs]) => {
        const start = new Date(startTs)
        const end = new Date(endTs)
        let day = new Date(start)
        let total = 0
        while (day < end) {
          total += Number(dailyMap[getDayStr(day)] || 0)
          day.setDate(day.getDate() + 1)
        }
        return total
      }
      const currentVisits = countVisitsInRange(currentRange)
      const prevVisits = countVisitsInRange(prevRange)

      const categoryMap = new Map()
      products.forEach(p => {
        const key = p.category || 'Khác'
        const cat = categoryMap.get(key) || { name: key, products: 0, views: 0 }
        cat.products += 1
        cat.views += Number(p.views || 0)
        categoryMap.set(key, cat)
      })
      const categoryStats = Array.from(categoryMap.values())
      const totalViewsForPercent = sum(categoryStats.map(c => c.views)) || 1
      categoryStats.forEach(c => { c.percentage = Number(((c.views / totalViewsForPercent) * 100).toFixed(1)) })

      // Monthly visits using dailyMap (last 12 months)
      const monthlyViews = [...Array(12)].map((_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (11 - i))
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        const views = countVisitsInRange([start.getTime(), end.getTime()])
        const month = `T${date.getMonth() + 1}`
        return { month, views }
      })

      const topProducts = [...products]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(p => ({ name: p.name, views: p.views || 0, category: p.category || 'Khác' }))

      const computeTrend = (current, previous) => {
        const diff = current - previous
        const change = previous === 0 ? (current > 0 ? '+100%' : '0%') : `${diff > 0 ? '+' : ''}${((diff / previous) * 100).toFixed(1)}%`
        return { current, previous, change, trend: diff >= 0 ? 'up' : 'down' }
      }

      const trends = {
        products: computeTrend(currentProducts.length, prevProducts.length),
        views: computeTrend(currentVisits, prevVisits),
        users: computeTrend(0, 0),
        events: computeTrend(currentEvents.length, prevEvents.length)
      }

      setAnalyticsData({
        overview: { totalProducts, totalViews: currentVisits, totalUsers: 0, totalEvents },
        trends,
        categoryStats,
        monthlyViews,
        topProducts,
        userActivity: { newUsers: 0, activeUsers: 0, returningUsers: 0, avgSessionTime: '—' }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getTrendColor = (trend) => (trend === 'up' ? 'text-green-600' : 'text-red-600')

  const formatNumber = (num) => {
    const n = Number(num || 0)
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  const escapeCsv = (s='') => '"' + String(s).replaceAll('"','""') + '"'
  const exportCsv = () => {
    const lines = []
    // Tổng quan
    lines.push('Tổng quan')
    const o = analyticsData.overview || {}
    lines.push(['Chỉ số','Giá trị'].join(','))
    lines.push(['Tổng sản phẩm', o.totalProducts ?? 0].join(','))
    lines.push(['Tổng lượt truy cập', o.totalViews ?? 0].join(','))
    lines.push(['Tổng sự kiện', o.totalEvents ?? 0].join(','))
    lines.push('')

    // Xu hướng
    lines.push('Xu hướng')
    lines.push(['Chỉ số','Hiện tại','Kỳ trước','Thay đổi','Xu hướng'].join(','))
    Object.entries(analyticsData.trends || {}).forEach(([k,v])=>{
      const label = k === 'products' ? 'Sản phẩm mới' : k === 'views' ? 'Lượt truy cập' : k === 'events' ? 'Sự kiện' : 'Người dùng'
      lines.push([label, v.current ?? 0, v.previous ?? 0, v.change ?? '', v.trend ?? ''].join(','))
    })
    lines.push('')

    // Phân bố danh mục
    lines.push('Phân bố danh mục')
    lines.push(['Danh mục','Sản phẩm','Lượt xem','Tỷ lệ %'].join(','))
    ;(analyticsData.categoryStats||[]).forEach(c=>{
      lines.push([escapeCsv(c.name), c.products ?? 0, c.views ?? 0, c.percentage ?? 0].join(','))
    })
    lines.push('')

    // Top sản phẩm
    lines.push('Top sản phẩm')
    lines.push(['Tên','Danh mục','Lượt xem'].join(','))
    ;(analyticsData.topProducts||[]).forEach(p=>{
      lines.push([escapeCsv(p.name), escapeCsv(p.category), p.views ?? 0].join(','))
    })
    lines.push('')

    // Lượt truy cập theo tháng
    lines.push('Lượt truy cập theo tháng')
    lines.push(['Tháng','Lượt truy cập'].join(','))
    ;(analyticsData.monthlyViews||[]).forEach(m=>{
      lines.push([m.month, m.views ?? 0].join(','))
    })

    // Thêm BOM để Excel hiển thị tiếng Việt đúng
    const csv = '\uFEFF' + lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${timeRange}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportXlsx = () => {
    const wb = XLSX.utils.book_new()
    const o = analyticsData.overview || {}
    const wsOverview = XLSX.utils.aoa_to_sheet([
      ['Chỉ số','Giá trị'],
      ['Tổng sản phẩm', o.totalProducts ?? 0],
      ['Tổng lượt truy cập', o.totalViews ?? 0],
      ['Tổng sự kiện', o.totalEvents ?? 0]
    ])
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Tổng quan')

    const trends = [['Chỉ số','Hiện tại','Kỳ trước','Thay đổi','Xu hướng']]
    Object.entries(analyticsData.trends || {}).forEach(([k,v])=>{
      const label = k === 'products' ? 'Sản phẩm mới' : k === 'views' ? 'Lượt truy cập' : k === 'events' ? 'Sự kiện' : 'Người dùng'
      trends.push([label, v.current ?? 0, v.previous ?? 0, v.change ?? '', v.trend ?? ''])
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trends), 'Xu hướng')

    const cats = [['Danh mục','Sản phẩm','Lượt xem','Tỷ lệ %'],
      ...(analyticsData.categoryStats||[]).map(c=>[c.name, c.products ?? 0, c.views ?? 0, c.percentage ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cats), 'Danh mục')

    const tops = [['Tên','Danh mục','Lượt xem'],
      ...(analyticsData.topProducts||[]).map(p=>[p.name, p.category, p.views ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tops), 'Top sản phẩm')

    const monthly = [['Tháng','Lượt truy cập'],
      ...(analyticsData.monthlyViews||[]).map(m=>[m.month, m.views ?? 0])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(monthly), 'Tháng')

    XLSX.writeFile(wb, `analytics_${timeRange}_${Date.now()}.xlsx`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Đang tải thống kê...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thống kê & Phân tích</h1>
              <p className="text-gray-600 mt-2">Phân tích dữ liệu thực từ hệ thống</p>
            </div>
            <div className="flex items-center space-x-3">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
              <button onClick={loadAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {Object.entries(analyticsData.trends || {}).map(([key, data]) => {
            const icons = { products: Package, views: Eye, users: Users, events: Calendar }
            const Icon = icons[key]
            const labels = { products: 'Sản phẩm mới', views: 'Tổng lượt xem', users: 'Người dùng', events: 'Sự kiện' }
            const colors = { products: 'primary', views: 'success', users: 'info', events: 'warning' }
            const color = colors[key] || 'primary'
            return (
              <div key={key} className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6 className="card-title text-muted mb-1">{labels[key]}</h6>
                        <h3 className={`fw-bold text-${color} mb-0`}>{formatNumber(data.current)}</h3>
                      </div>
                      <div className={`p-3 bg-${color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`} style={{width: '50px', height: '50px'}}>
                        <Icon className={`w-5 h-5 text-${color}`} />
                      </div>
                    </div>
                    {key !== 'users' && key !== 'events' && (
                      <div className="d-flex align-items-center">
                        {getTrendIcon(data.trend)}
                        <span className={`text-sm fw-medium ms-2 ${getTrendColor(data.trend)}`}>{data.change}</span>
                        <span className="text-sm text-muted ms-2">so với kỳ trước</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="row g-4 mb-5">
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Phân bố danh mục</h5>
                  <PieChart className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="card-body">
                {/* Pie Chart Visualization */}
                <div className="row align-items-center">
                  <div className="col-5">
                    <div className="position-relative d-flex justify-content-center" style={{width: '100%', height: '250px'}}>
                      <div className="position-relative" style={{width: '200px', height: '200px'}}>
                        <svg width="200" height="200" className="position-absolute top-0 start-0">
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="25"
                          />
                          {analyticsData.categoryStats?.map((category, index) => {
                            const total = analyticsData.categoryStats.reduce((sum, cat) => sum + (cat.percentage || 0), 0)
                            const percentage = (category.percentage || 0) / total
                            const circumference = 2 * Math.PI * 80
                            const strokeDasharray = circumference
                            const strokeDashoffset = circumference * (1 - percentage)
                            const colors = ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997']
                            const color = colors[index % colors.length]
                            
                            return (
                              <circle
                                key={category.name}
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke={color}
                                strokeWidth="25"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                transform={`rotate(${index * 360 / analyticsData.categoryStats.length} 100 100)`}
                                className="transition-all"
                                style={{transition: 'all 0.3s ease'}}
                              />
                            )
                          })}
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <div className="fw-bold text-primary" style={{fontSize: '2rem'}}>
                            {analyticsData.categoryStats?.length || 0}
                          </div>
                          <small className="text-muted">Danh mục</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-7">
                    <div className="row g-3">
                      {analyticsData.categoryStats?.map((category, index) => {
                        const colors = ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997']
                        const color = colors[index % colors.length]
                        return (
                          <div key={category.name} className="col-12">
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <div 
                                className="w-4 h-4 rounded-circle me-3" 
                                style={{ backgroundColor: color }}
                              ></div>
                              <div className="flex-grow-1">
                                <div className="fw-medium text-dark">{category.name}</div>
                                <div className="text-muted small">
                                  {category.products} sản phẩm • {category.percentage}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Sản phẩm nổi bật</h5>
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
              </div>
              <div className="card-body">
                {/* Horizontal Bar Chart */}
                <div className="row g-3">
                  {analyticsData.topProducts?.map((p, index) => {
                    const maxViews = Math.max(...analyticsData.topProducts.map(x => x.views)) || 1
                    const percentage = (p.views / maxViews) * 100
                    const colors = ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1']
                    const color = colors[index % colors.length]
                    
                    return (
                      <div key={p.name} className="col-12">
                        <div className="mb-2">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <div className="d-flex align-items-center">
                              <div className="w-6 h-6 bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center me-2">
                                <span className="fw-bold text-primary" style={{fontSize: '0.75rem'}}>{index + 1}</span>
                              </div>
                              <div>
                                <p className="mb-0 fw-medium text-dark small">{p.name}</p>
                                <small className="text-muted" style={{fontSize: '0.7rem'}}>{p.category}</small>
                              </div>
                            </div>
                            <span className="fw-bold text-dark small">{formatNumber(p.views)}</span>
                          </div>
                          <div className="progress" style={{height: '8px'}}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color,
                                transition: 'width 0.6s ease'
                              }}
                              aria-valuenow={percentage} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart for Trends */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Xu hướng theo thời gian</h5>
              <Activity className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <div className="position-relative" style={{height: '300px'}}>
                  <svg width="100%" height="300" className="border rounded">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f8f9fa" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((value, index) => (
                      <g key={value}>
                        <line 
                          x1="50" 
                          y1={50 + index * 50} 
                          x2="100%" 
                          y2={50 + index * 50} 
                          stroke="#e9ecef" 
                          strokeWidth="1"
                        />
                        <text 
                          x="40" 
                          y={55 + index * 50} 
                          textAnchor="end" 
                          className="text-muted small"
                          fill="#6c757d"
                        >
                          {value}%
                        </text>
                      </g>
                    ))}
                    
                    {/* Real trend lines */}
                    {analyticsData.monthlyViews?.length > 0 && (
                      <>
                        {/* Views trend */}
                        <polyline
                          fill="none"
                          stroke="#0d6efd"
                          strokeWidth="3"
                          points={analyticsData.monthlyViews.map((m, index) => {
                            const chartWidth = 800 // Fixed width for consistent calculation
                            const x = 80 + (index * (chartWidth - 160) / Math.max(analyticsData.monthlyViews.length - 1, 1))
                            const maxViews = Math.max(...analyticsData.monthlyViews.map(x => x.views)) || 1
                            const y = 250 - ((m.views / maxViews) * 200)
                            return `${x},${y}`
                          }).join(' ')}
                        />
                        
                        {/* Data points */}
                        {analyticsData.monthlyViews.map((m, index) => {
                          const chartWidth = 800
                          const x = 80 + (index * (chartWidth - 160) / Math.max(analyticsData.monthlyViews.length - 1, 1))
                          const maxViews = Math.max(...analyticsData.monthlyViews.map(x => x.views)) || 1
                          const y = 250 - ((m.views / maxViews) * 200)
                          return (
                            <g key={index}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#0d6efd"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="small fw-bold"
                                fill="#0d6efd"
                                style={{fontSize: '10px'}}
                              >
                                {formatNumber(m.views)}
                              </text>
                            </g>
                          )
                        })}
                        
                        {/* X-axis labels */}
                        {analyticsData.monthlyViews.map((m, index) => {
                          const chartWidth = 800
                          const x = 80 + (index * (chartWidth - 160) / Math.max(analyticsData.monthlyViews.length - 1, 1))
                          return (
                            <text
                              key={index}
                              x={x}
                              y="290"
                              textAnchor="middle"
                              className="small text-muted"
                              fill="#6c757d"
                              style={{fontSize: '11px'}}
                            >
                              {m.month}
                            </text>
                          )
                        })}
                      </>
                    )}
                  </svg>
                  
                  {/* Legend */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <div className="d-flex align-items-center">
                      <div className="w-3 h-3 bg-primary rounded-circle me-2"></div>
                      <span className="small text-muted">Lượt xem</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Lượt xem theo tháng</h5>
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
          </div>
          <div className="card-body">
            <div className="row g-2 align-items-end" style={{height: '280px'}}>
              {analyticsData.monthlyViews?.map((m, idx) => {
                const maxViews = Math.max(...analyticsData.monthlyViews.map(x => x.views)) || 1
                const height = (m.views / maxViews) * 100
                const colors = ['#0d6efd', '#198754', '#fd7e14', '#dc3545', '#6f42c1', '#20c997', '#ffc107']
                const color = colors[idx % colors.length]
                
                return (
                  <div key={m.month} className="col">
                    <div className="d-flex flex-column align-items-center h-100 position-relative">
                      {/* Value display */}
                      <div className="position-absolute top-0 start-50 translate-middle-x mb-2">
                        <div className="bg-dark text-white px-2 py-1 rounded small fw-bold">
                          {formatNumber(m.views)}
                        </div>
                      </div>
                      
                      {/* Bar chart */}
                      <div className="w-100 bg-light rounded-top position-relative mt-4" style={{height: '200px'}}>
                        <div 
                          className="rounded-top position-absolute bottom-0 w-100 transition-all" 
                          style={{ 
                            height: `${height}%`,
                            background: `linear-gradient(to top, ${color}, ${color}dd)`,
                            boxShadow: `0 2px 4px ${color}40`
                          }}
                          data-bs-toggle="tooltip" 
                          title={`${formatNumber(m.views)} lượt xem - ${m.month}`}
                        ></div>
                      </div>
                      
                      {/* Month label */}
                      <small className="text-muted mt-2 fw-medium">{m.month}</small>
                      
                      {/* Percentage */}
                      <small className="text-muted" style={{fontSize: '0.7rem'}}>
                        {((m.views / maxViews) * 100).toFixed(1)}%
                      </small>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Summary */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="bg-light rounded p-3">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="fw-bold text-primary">{formatNumber(Math.max(...analyticsData.monthlyViews?.map(x => x.views) || [0]))}</div>
                      <small className="text-muted">Cao nhất</small>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-success">{formatNumber(Math.round(analyticsData.monthlyViews?.reduce((sum, x) => sum + x.views, 0) / analyticsData.monthlyViews?.length || 0))}</div>
                      <small className="text-muted">Trung bình</small>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold text-info">{formatNumber(analyticsData.monthlyViews?.reduce((sum, x) => sum + x.views, 0) || 0)}</div>
                      <small className="text-muted">Tổng cộng</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-12 col-md-8">
                <h5 className="card-title mb-1">Xuất báo cáo</h5>
                <p className="card-text text-muted mb-0">Tải xuống báo cáo chi tiết dưới dạng CSV hoặc Excel</p>
              </div>
              <div className="col-12 col-md-4 mt-3 mt-md-0">
                <div className="d-flex gap-2 justify-content-md-end">
                  <button onClick={exportCsv} className="btn btn-outline-primary d-flex align-items-center" style={{textDecoration: 'none'}}>
                    <Download className="w-4 h-4 me-2" />
                    CSV
                  </button>
                  <button onClick={exportXlsx} className="btn btn-outline-success d-flex align-items-center" style={{textDecoration: 'none'}}>
                    <Download className="w-4 h-4 me-2" />
                    XLSX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
