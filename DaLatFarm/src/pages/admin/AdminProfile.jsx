import React, { useEffect, useMemo, useState } from 'react'

const KEY_NAME = 'dalatfarm:admin:profileName'
const KEY_EMAIL = 'dalatfarm:admin:profileEmail'
const KEY_PHONE = 'dalatfarm:admin:profilePhone'
const KEY_BIO = 'dalatfarm:admin:profileBio'
const KEY_AVATAR = 'dalatfarm:admin:profileAvatar'

const DEFAULTS = {
  name: 'Admin User',
  email: 'admin@dalatfarm.com',
  phone: '',
  bio: '',
  avatar: ''
}

const AdminProfile = () => {
  const [name, setName] = useState(DEFAULTS.name)
  const [email, setEmail] = useState(DEFAULTS.email)
  const [phone, setPhone] = useState(DEFAULTS.phone)
  const [bio, setBio] = useState(DEFAULTS.bio)
  const [avatar, setAvatar] = useState(DEFAULTS.avatar)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const n = localStorage.getItem(KEY_NAME) || DEFAULTS.name
      const e = localStorage.getItem(KEY_EMAIL) || DEFAULTS.email
      const p = localStorage.getItem(KEY_PHONE) || DEFAULTS.phone
      const b = localStorage.getItem(KEY_BIO) || DEFAULTS.bio
      const a = localStorage.getItem(KEY_AVATAR) || DEFAULTS.avatar
      setName(n); setEmail(e); setPhone(p); setBio(b); setAvatar(a)
    } catch {}
  }, [])

  const onPickAvatar = async (file) => {
    if (!file) return
    const toDataUrl = (f) =>
      new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = () => res(r.result)
        r.onerror = rej
        r.readAsDataURL(f)
      })
    try {
      const dataUrl = await toDataUrl(file)
      setAvatar(dataUrl)
    } catch {}
  }

  const initials = useMemo(() => {
    const s = (name || DEFAULTS.name).trim()
    const parts = s.split(/\s+/)
    const a = (parts[0] || 'A')[0]
    const b = (parts[parts.length - 1] || 'U')[0]
    return (a + b).toUpperCase()
  }, [name])

  const save = async (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem(KEY_NAME, (name || DEFAULTS.name).trim())
      localStorage.setItem(KEY_EMAIL, (email || DEFAULTS.email).trim())
      localStorage.setItem(KEY_PHONE, (phone || DEFAULTS.phone).trim())
      localStorage.setItem(KEY_BIO, (bio || DEFAULTS.bio).trim())
      if (avatar) localStorage.setItem(KEY_AVATAR, avatar); else localStorage.removeItem(KEY_AVATAR)
      window.dispatchEvent(new Event('dalatfarm:admin:profileUpdated'))
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch {}
    setSaving(false)
  }

  const resetDefaults = () => {
    setName(DEFAULTS.name)
    setEmail(DEFAULTS.email)
    setPhone(DEFAULTS.phone)
    setBio(DEFAULTS.bio)
    setAvatar(DEFAULTS.avatar)
    try {
      localStorage.removeItem(KEY_NAME)
      localStorage.removeItem(KEY_EMAIL)
      localStorage.removeItem(KEY_PHONE)
      localStorage.removeItem(KEY_BIO)
      localStorage.removeItem(KEY_AVATAR)
      window.dispatchEvent(new Event('dalatfarm:admin:profileUpdated'))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ Admin</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover ring-2 ring-orange-200" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-semibold ring-2 ring-orange-200">
                      {initials}
                    </div>
                  )}
                </div>
                <label className="mt-4 cursor-pointer text-sm text-orange-700 hover:text-orange-800">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickAvatar(e.target.files?.[0])} />
                  Chọn ảnh đại diện
                </label>
                {avatar && (
                  <button type="button" onClick={() => setAvatar('')} className="mt-2 text-xs text-gray-500 hover:text-gray-700">
                    Gỡ ảnh
                  </button>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tên hiển thị</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Admin User"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="admin@dalatfarm.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="09xxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Giới thiệu</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Mô tả ngắn về admin, vai trò, ghi chú..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Khôi phục mặc định
                </button>
                {saved && <span className="text-green-600 text-sm">Đã lưu!</span>}
              </div>
            </div>
          </form>
        </div>

        {bio && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Giới thiệu hiển thị</h2>
            <p className="text-gray-600 text-sm whitespace-pre-line">{bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProfile