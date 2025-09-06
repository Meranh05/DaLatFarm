import React, { useState } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import RealTimeStatus from './RealTimeStatus'

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}>
          <div className="p-3 lg:p-5 scale-[0.95] origin-top-left text-[13px] md:text-[14px] max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
