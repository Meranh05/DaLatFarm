import React, { useState } from 'react'
import { useProducts } from '../../context/ProductContext'

const ProductFilter = () => {
  const { categories } = useProducts()
  const [selectedCategories, setSelectedCategories] = useState([])

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )

  const FilterOption = ({ category }) => {
    const isSelected = selectedCategories.includes(category)

    return (
      <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleCategoryChange(category)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="ml-2 text-sm text-gray-700">{category}</span>
        </div>
      </label>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
      
      <FilterSection title="Danh mục">
        {categories.length > 0 ? (
          categories.map(category => (
            <FilterOption key={category} category={category} />
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            Đang tải danh mục...
          </div>
        )}
      </FilterSection>
    </div>
  )
}

export default ProductFilter
