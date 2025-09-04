import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import AppRoutes from './routes/AppRoutes'
import AdminRoutes from './routes/AdminRoutes'
import './styles/index.css'

function App() {
  return (
    <ProductProvider>
      <div className="App">
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </ProductProvider>
  )
}

export default App
