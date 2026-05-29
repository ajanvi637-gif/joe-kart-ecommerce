import React from 'react'
import { Button } from './button'
import { Input } from '@/input'


const FilterSidebar = ({ search, setSearch, brand, setBrand, category, setCategory, setPriceRange, allProducts, priceRange }) => {

  const Categories = allProducts.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]

  const Brands = allProducts.map(p => p.brand)
  const UniqueBrands = ["All", ...new Set(Brands)]
  console.log(UniqueBrands);



  // Category click
  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  // Brand change
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  // Min price change
  const handleMinChange = (e) => {
    const value = Number(e.target.value);

    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  // Max price change
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);

    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div className="hidden md:block w-72 mt-10">

      <div className="sticky top-24 p-[1px] rounded-2xl shadow-xl">

        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5">

          {/* 🔍 Search */}
          <div className="mb-6">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/70 border border-pink-200 rounded-lg px-3 py-2 
            focus:ring-2 focus:ring-pink-400 outline-none transition shadow-sm"
            />
          </div>

          {/* 📂 Category */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">
              Category
            </h2>

            <div className="flex flex-col gap-2">
              {UniqueCategory.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer 
                transition-all duration-300 group
                ${category === item
                      ? "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 shadow-md scale-[1.02]"
                      : "hover:bg-pink-50 hover:scale-[1.01]"
                    }`}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === item}
                    onChange={() => handleCategoryClick(item)}
                    className="accent-pink-500"
                  />
                  <span className="transition">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 🏷️ Brand */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Brand
            </h2>

            <div className="relative">
              <select
                value={brand}
                onChange={handleBrandChange}
                className="w-full appearance-none bg-pink-50 border border-pink-300 
                     text-gray-700 rounded-lg px-3 py-2 pr-10
                       focus:ring-2 focus:ring-pink-400 focus:border-pink-400 
                       outline-none transition shadow-sm"
                       >
                {UniqueBrands.map((item, index) => (
                  <option key={index} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Custom dropdown icon */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 pointer-events-none">
                ▼
              </span>
            </div>
          </div>

          {/* 💰 Price Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-wide">
              Price Range
            </h2>

            <p className="text-sm text-gray-600 mb-3 font-medium">
              ₹{priceRange[0]} — ₹{priceRange[1]}
            </p>

            {/* Inputs */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={handleMinChange}
                className="w-20 px-2 py-1 border border-pink-200 rounded-md 
              focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={handleMaxChange}
                className="w-20 px-2 py-1 border border-pink-200 rounded-md 
              focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[0]}
                onChange={handleMinChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="999999"
                step="100"
                value={priceRange[1]}
                onChange={handleMaxChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 🔄 Reset Button */}
          <Button
            onClick={resetFilters}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 
            hover:from-pink-600 hover:to-pink-700 text-white py-2 rounded-xl 
             font-semibold shadow-lg hover:shadow-pink-300/50 
             transition-all duration-300 hover:scale-[1.02]"
          >
            Reset Filters
          </Button>

        </div>
      </div>
    </div>
  )
}

export default FilterSidebar