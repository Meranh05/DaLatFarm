import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'dalatfarm:admin:auth'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        navigate('/admin', { replace: true })
      }
    } catch {}
  }, [navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const ok = username.trim() === 'admin' && password === 'TeamDaLatFarm'
    await new Promise(r => setTimeout(r, 250))

    setSubmitting(false)
    if (ok) {
      try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      navigate('/admin', { replace: true })
    } else {
      setError('Sai tài khoản hoặc mật khẩu')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <img src="/images/logoAdmin.png" alt="DaLat Farm" className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Đăng nhập Admin</h1>
            <p className="text-sm text-gray-500">Trang quản trị DaLat Farm</p>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tài khoản</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="admin"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="TeamDaLatFarm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg px-4 py-2 transition disabled:opacity-60"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
