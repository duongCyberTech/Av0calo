import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import placeholderImg from '../assets/product-placeholder.svg';
import { fetchJSON } from '../utils/api';

const Product = () => {
  const navigate = useNavigate();
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(300000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  const ratings = [5, 4, 3, 2, 1];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchJSON('/products/all', { method: 'GET' });
        console.log('API Response:', response);

        // Backend returns array directly, not wrapped in result
        const productList = Array.isArray(response) ? response : (response.result || []);

        // Transform data to match frontend structure
        const transformedProducts = productList.map(p => ({
          pid: p.pid,
          name: p.title,
          price: p.sell_price || p.price || 0,
          rating: p.rating || 0,
          reviews: p.sold ? `${p.sold}+` : '0',
          thumbnail: p.thumbnail || null,
          images: (Array.isArray(p.images) && p.images.length > 0)
            ? p.images
            : (p.thumbnail ? [p.thumbnail] : []),
          categoryId: p.cate_id,
          categoryName: p.cate_name,
          stock: p.stock
        }));

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);

        // Initialize image index for all products
        const imageIndexMap = {};
        transformedProducts.forEach(p => {
          imageIndexMap[p.pid] = 0;
        });
        setCurrentImageIndex(imageIndexMap);

        // Auto-set max price based on highest product price
        if (transformedProducts.length > 0) {
          const maxProductPrice = Math.max(...transformedProducts.map(p => p.price));
          setPriceMax(Math.ceil(maxProductPrice / 100000) * 100000); // Round up to nearest 100k
        }

        // Build dynamic categories from API results
        const categoryMap = new Map();
        productList.forEach(p => {
          if (p.cate_id != null) {
            categoryMap.set(p.cate_id, p.cate_name || `Danh mục ${p.cate_id}`);
          }
        });
        const dynamicCategories = Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }));
        setCategories(dynamicCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(`Không thể tải danh sách sản phẩm: ${err.message || 'Lỗi kết nối'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.categoryId)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceMin && product.price <= priceMax
    );

    // Filter by rating
    if (selectedRating) {
      filtered = filtered.filter(product =>
        Math.floor(product.rating || 0) >= selectedRating
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchQuery, selectedCategories, priceMin, priceMax, selectedRating]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedRating(null);
    setPriceMin(0);
    setPriceMax(400000);
    setSearchQuery('');
  };

  const handleApplyFilters = () => {
    // Filters are already applied via useEffect
    // This is just for user feedback
    console.log('Filters applied');
  };

  return (
    <div className="bg-[#F1F8E9] min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-4 mt-2">
        {/* Breadcrumb */}
        <div className="text-base text-[#237928] font-light mb-3 sticky top-0 z-30 bg-[#F1F8E9] py-2 pl-6">
          <Link to="/" className="underline underline-offset-4">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <span>Sản phẩm</span>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filter */}
          <aside className="w-64 flex-shrink-0 sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto bg-[#F1F8E9] border-r-2 border-white">
            <div className="bg-[#F1F8E9] rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#237928]">LỌC SẢN PHẨM</h2>
                <button className="text-[#237928] hover:text-[#2a4020]">
                  <i className="fas fa-sliders-h"></i>
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-base text-[#237928]">DANH MỤC</h3>
                <div className="space-y-3">
                  {categories.length === 0 ? (
                    <p className="text-xs text-gray-500">Chưa có danh mục</p>
                  ) : (
                    categories.map(category => (
                      <label key={category.id} className="flex items-center justify-between cursor-pointer">
                        <span className="text-base text-[#237928] font-light">{category.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-5 h-5 text-[#3D5B2E] border-2 border-[#3D5B2E] rounded focus:ring-[#3D5B2E] focus:ring-2"
                          style={{ accentColor: '#3D5B2E' }}
                        />
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-base text-[#237928]">KHOẢNG GIÁ</h3>
                <div className="flex gap-4 mb-3">
                  <div className="flex-1">
                    <label className="text-sm text-[#237928] mb-1 block font-light">Tối thiểu</label>
                    <input
                      type="number"
                      value={priceMin}
                      min={0}
                      max={300000}
                      step={1000}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setPriceMin(v);
                        if (v > priceMax) setPriceMax(v);
                      }}
                      className="w-full px-3 py-2 border border-[#3D5B2E] rounded text-sm text-[#237928] focus:outline-none focus:ring-2 focus:ring-[#3D5B2E]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-[#237928] mb-1 block font-light">Tối đa</label>
                    <input
                      type="number"
                      value={priceMax}
                      min={0}
                      max={300000}
                      step={1000}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setPriceMax(v);
                        if (v < priceMin) setPriceMin(v);
                      }}
                      className="w-full px-3 py-2 border border-[#3D5B2E] rounded text-sm text-[#237928] focus:outline-none focus:ring-2 focus:ring-[#3D5B2E]"
                    />
                  </div>
                </div>
                {/* Dual-thumb range slider */}
                <div className="relative h-6 flex items-center">
                  {/* Track background */}
                  <div className="absolute w-full h-1.5 bg-[#BCDBBE] rounded-full pointer-events-none" />

                  {/* Active range highlight */}
                  <div
                    className="absolute h-1.5 bg-[#237928] rounded-full pointer-events-none"
                    style={{
                      left: `${(priceMin / 400000) * 100}%`,
                      right: `${100 - (priceMax / 400000) * 100}%`
                    }}
                  />

                  {/* Min slider */}
                  <input
                    type="range"
                    min={0}
                    max={400000}
                    step={1000}
                    value={priceMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceMin(v);
                      if (v > priceMax) setPriceMax(v);
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#237928] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#237928] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      zIndex: priceMin > 400000 - priceMax ? 5 : 3
                    }}
                  />

                  {/* Max slider */}
                  <input
                    type="range"
                    min={0}
                    max={400000}
                    step={1000}
                    value={priceMax}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceMax(v);
                      if (v < priceMin) setPriceMin(v);
                    }}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#237928] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#237928] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      zIndex: priceMin > 300000 - priceMax ? 3 : 5
                    }}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-base text-[#237928]">ĐÁNH GIÁ</h3>
                <div className="flex gap-2 flex-wrap">
                  {ratings.map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${selectedRating === rating
                        ? 'bg-[#3D5B2E] text-white border-[#3D5B2E]'
                        : 'bg-white text-[#3D5B2E] border-[#3D5B2E] hover:bg-[#3D5B2E] hover:text-white'
                        }`}
                    >
                      <span className="font-medium">≥{rating}</span>
                      <i className="fas fa-star text-yellow-400 text-xs"></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2.5 text-[#237928] rounded-full text-sm font-medium transition-all"
                  style={{ borderWidth: '2px', borderColor: 'rgba(35, 121, 40, 0.68)' }}
                >
                  Xóa lọc
                </button>
                <button className="flex-1 px-4 py-2.5 bg-[#91EAAF] text-black rounded-full text-sm font-medium hover:bg-[#4CAF50] transition-all shadow-md hover:shadow-lg" onClick={handleApplyFilters}>
                  Áp dụng
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-4 -mt-2 flex justify-center">
              <div className="relative w-full max-w-[480px]">
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-[#237928] text-[#237928] placeholder-[#237928]/70 font-light focus:outline-none focus:border-[#237928] focus:ring-0"
                  style={{ borderRadius: '62px', backgroundColor: 'rgba(35, 121, 40, 0.05)' }}
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#237928]"></i>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-[#3D5B2E]"></i>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <i className="fas fa-exclamation-circle text-4xl text-red-500"></i>
                <p className="mt-4 text-red-600">{error}</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
              <>
                {currentProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-box-open text-4xl text-gray-400"></i>
                    <p className="mt-4 text-gray-600">Không tìm thấy sản phẩm</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ml-3 md:ml-6">
                    {currentProducts.map(product => {
                      const currentImgIdx = currentImageIndex[product.pid] || 0;
                      const hasMultipleImages = product.images && product.images.length > 1;
                      const currentImage = (product.images && product.images.length > 0)
                        ? product.images[currentImgIdx]
                        : (product.thumbnail || placeholderImg);

                      const handlePrevImage = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentImageIndex(prev => ({
                          ...prev,
                          [product.pid]: currentImgIdx > 0 ? currentImgIdx - 1 : product.images.length - 1
                        }));
                      };

                      const handleNextImage = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentImageIndex(prev => ({
                          ...prev,
                          [product.pid]: currentImgIdx < product.images.length - 1 ? currentImgIdx + 1 : 0
                        }));
                      };

                      return (
                        <div
                          key={product.pid || product.id}
                          className="rounded-3xl pt-6 pb-6 px-6 transition-all duration-300 hover:-translate-y-1 overflow-visible relative mt-28 w-60 mx-auto cursor-pointer"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                          onClick={() => navigate(`/product/${product.pid}`)}
                          onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/product/${product.pid}`); }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Xem chi tiết ${product.name}`}
                        >
                          {/* Product Image */}
                          <div className="flex justify-center mb-4 -mt-28 relative">
                            <Link to={`/product/${product.pid}`} className="w-44 h-44 rounded-full overflow-hidden p-2.5 shadow-md" style={{ backgroundColor: 'rgba(46, 125, 50, 0.81)' }}>
                              <div className="w-full h-full rounded-full overflow-hidden bg-[#F9FBF7] flex items-center justify-center">
                                <img
                                  src={currentImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover object-center"
                                  onError={(e) => {
                                    e.target.src = placeholderImg;

                                    {/* Navigation buttons - only show if multiple images */ }
                                    {
                                      hasMultipleImages && (
                                        <>
                                          <button
                                            onClick={handlePrevImage}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#237928] transition-all z-10"
                                            aria-label="Ảnh trước"
                                          >
                                            <i className="fas fa-chevron-left text-sm"></i>
                                          </button>
                                          <button
                                            onClick={handleNextImage}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#237928] transition-all z-10"
                                            aria-label="Ảnh tiếp theo"
                                          >
                                            <i className="fas fa-chevron-right text-sm"></i>
                                          </button>

                                          {/* Image indicator dots */}
                                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                            {product.images.map((_, idx) => (
                                              <div
                                                key={idx}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIdx ? 'bg-[#237928] w-3' : 'bg-gray-300'
                                                  }`}
                                              />
                                            ))}
                                          </div>
                                        </>
                                      )
                                    }
                                  }}
                                />
                              </div>
                            </Link>
                          </div>

                          {/* Product Name */}
                          <h3 className="text-center text-lg font-semibold text-[#237928] mb-2">
                            <Link to={`/product/${product.pid}`}>{product.name}</Link>
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center justify-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star text-base ${i < Math.floor(product.rating || 0) ? 'text-[#FFB800]' : 'text-gray-300'
                                  }`}
                              ></i>
                            ))}
                            <span className="text-xs text-gray-600 ml-1 font-medium">({product.reviews || '0'})</span>
                          </div>

                          {/* Price and Button */}
                          <div className="flex items-center justify-center gap-3">
                            <span className="px-4 py-2 text-[#3D5B2E] rounded-full text-sm font-semibold shadow-[inset_0_0_0_2px_#4A9F67]">
                              {(product.price || 0).toLocaleString('vi-VN')}
                            </span>
                            <Link to={`/product/${product.pid}`} className="px-5 py-2 bg-[#91EAAF] text-black rounded-full text-sm font-semibold hover:bg-[#4CAF50] transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
                              Mua ngay
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded flex items-center gap-1 ${currentPage === 1
                        ? 'bg-gray-300 text-white cursor-not-allowed'
                        : 'bg-[#91EAAF] text-black hover:brightness-95'
                        }`}
                    >
                      <i className="fas fa-arrow-left"></i>
                      <span>Trước</span>
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Show only nearby pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded ${currentPage === page
                              ? 'bg-[#3D5B2E] text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded flex items-center gap-1 ${currentPage === totalPages
                        ? 'bg-gray-300 text-white cursor-not-allowed'
                        : 'bg-[#91EAAF] text-black hover:brightness-95'
                        }`}
                    >
                      <span>Sau</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;