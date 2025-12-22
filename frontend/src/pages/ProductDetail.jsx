import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import placeholderImg from "../assets/product-placeholder.svg";
import { fetchJSON } from "../utils/api";
import { addToCart, clearCart } from "../services/cartService";
import { isAuthenticated } from "../services/userService";

const sizeOptions = [
    { label: "30ml", value: 30 },
    { label: "100ml", value: 100 },
    { label: "300ml", value: 300 },
];

const QuantityStepper = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                className="w-8 h-8 rounded-full bg-[#237928] text-white flex items-center justify-center"
                onClick={() => onChange(Math.max(1, value - 1))}
            >
                -
            </button>
            <span className="min-w-[24px] text-center">{value}</span>
            <button
                className="w-8 h-8 rounded-full bg-[#237928] text-white flex items-center justify-center"
                onClick={() => onChange(value + 1)}
            >
                +
            </button>
        </div>
    );
};

const ProductDetail = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const reviewsRef = useRef(null);
    const sampleReviews = [
        {
            name: "Hadone",
            location: "Đà Nẵng",
            rating: 5,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        },
        {
            name: "Twe Yang",
            location: "Hà Nội",
            rating: 5,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        },
        {
            name: "Yang Mike",
            location: "Hồ Chí Minh",
            rating: 5,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        },
        {
            name: "North S.",
            location: "Hải Phòng",
            rating: 4,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        },
        {
            name: "Fouque Chou",
            location: "Đà Lạt",
            rating: 4,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        },
        {
            name: "Hung Farm",
            location: "Huế",
            rating: 4,
            text: "Dầu thực vật này có chất lượng tinh khiết và mượt mà, giúp mỗi bữa ăn đều tươi ngon và đậm đà. Dầu có khả năng dẫn nhiệt đều, không để lại cảm giác ngấy dầu. Đây là lựa chọn đáng tin cậy cho chiên xào, nướng bánh hay nấu nướng hàng ngày.",
            date: "30 tháng 9, 2025"
        }
    ];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(sizeOptions[0].value);
    const [qty, setQty] = useState(1);
    const [activeSection, setActiveSection] = useState("detail");
    const [filterRating, setFilterRating] = useState(null);
    const [sortBy, setSortBy] = useState("latest");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewName, setReviewName] = useState("");
    const [reviewEmail, setReviewEmail] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewComment, setReviewComment] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);
    const [reviewFiles, setReviewFiles] = useState([]);
    const [visibleReviewCount, setVisibleReviewCount] = useState(6);

    // Filter and sort reviews
    const filteredAndSortedReviews = useMemo(() => {
        let result = [...reviews];

        // Filter by rating
        if (filterRating) {
            result = result.filter((rev) => Math.round(rev.rating || 0) === filterRating);
        }

        // Sort
        if (sortBy === "latest") {
            result.sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            });
        } else if (sortBy === "oldest") {
            result.sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateA - dateB;
            });
        } else if (sortBy === "highest") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === "lowest") {
            result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        }

        return result;
    }, [reviews, filterRating, sortBy]);

    const displayedReviews = useMemo(() => {
        return filteredAndSortedReviews.slice(0, Math.max(0, visibleReviewCount));
    }, [filteredAndSortedReviews, visibleReviewCount]);

    useEffect(() => {
        setVisibleReviewCount(6);
    }, [pid, filterRating, sortBy, activeSection]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            name: file.name,
            size: file.size
        }));
        setReviewFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setReviewFiles(prev => {
            const updated = [...prev];
            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch detail
                const detailRes = await fetchJSON(`/products/${pid}`, { method: "GET" });
                const detailData = detailRes?.data || detailRes;
                const detail = detailData
                    ? {
                        pid: detailData.pid,
                        name: detailData.title,
                        price: detailData.sell_price || detailData.price || 0,
                        rating: detailData.rating || 0,
                        reviews: detailData.sold ? `${detailData.sold}+` : "0",
                        thumbnail: detailData.thumbnail || null,
                        images: Array.isArray(detailData.images) ? detailData.images : (detailData.thumbnail ? [detailData.thumbnail] : []),
                        categoryId: detailData.cate_id,
                        categoryName: detailData.cate_name,
                        stock: detailData.stock,
                        description: detailData.description || ""
                    }
                    : null;
                setProduct(detail);

                // Fetch all for related
                const response = await fetchJSON("/products/all", { method: "GET" });
                const list = Array.isArray(response) ? response : response?.result || [];
                const transformed = list.map((p) => ({
                    pid: p.pid,
                    name: p.title,
                    price: p.sell_price || p.price || 0,
                    rating: p.rating || 0,
                    reviews: p.sold ? `${p.sold}+` : "0",
                    thumbnail: p.thumbnail || null,
                    images: p.thumbnail ? [p.thumbnail] : [],
                    categoryId: p.cate_id,
                    categoryName: p.cate_name,
                    stock: p.stock,
                    description:
                        p.description ||
                        "Dầu Bơ Avocalo ép lạnh từ trái bơ tươi ngon, giàu dưỡng chất, phù hợp chiên xào nướng ở nhiệt độ cao mà vẫn giữ được vị thơm nhẹ."
                }));
                setProducts(transformed);
            } catch (err) {
                setError(err?.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [pid]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setReviewsLoading(true);
                setReviewsError(null);
                // If backend has no reviews endpoint, this may 404; handle gracefully
                const res = await fetchJSON(`/products/${pid}/reviews`, { method: "GET" });
                const list = Array.isArray(res) ? res : res?.data || [];
                // Merge with any locally stored reviews (submitted by user)
                let local = [];
                try {
                    const raw = localStorage.getItem(`reviews:${pid}`);
                    local = raw ? JSON.parse(raw) : [];
                } catch (_) { }
                setReviews([...(local || []), ...list]);
            } catch (err) {
                // Even if API fails, still attempt to show local reviews
                let local = [];
                try {
                    const raw = localStorage.getItem(`reviews:${pid}`);
                    local = raw ? JSON.parse(raw) : [];
                } catch (_) { }
                setReviews(local || []);
                setReviewsError(err?.message || "Không tải được nhận xét");
            } finally {
                setReviewsLoading(false);
            }
        };
        loadReviews();
    }, [pid]);

    const related = useMemo(() => {
        if (!products?.length || !product) return [];
        const sameCate = products.filter(
            (p) => p.pid !== product.pid && p.categoryId === product.categoryId
        );
        const pick = (sameCate.length ? sameCate : products.filter((p) => p.pid !== product.pid)).slice(0, 5);
        return pick;
    }, [products, product]);

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            navigate('/login');
            return;
        }

        if (!product?.pid) {
            alert("Không tìm thấy thông tin sản phẩm");
            return;
        }

        try {
            await addToCart(product.pid, qty);
            alert(`Đã thêm ${qty} sản phẩm "${product.name}" vào giỏ hàng`);
        } catch (error) {
            const errorMessage = error?.body?.message || error?.message || "Không thể thêm vào giỏ hàng";
            alert(errorMessage);
            console.error("Error adding to cart:", error);
        }
    };

    const handleScrollToReviews = () => {
        if (reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const mainImg = product?.thumbnail || product?.images?.[0] || placeholderImg;
    const hasDescription = Boolean(product?.description && String(product.description).trim().length > 0);

    return (
        <div className="bg-[#F1F8E9] min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-6 mt-2">
                {/* Breadcrumb */}
                <div className="text-base text-[#237928] font-light mb-4 sticky top-0 z-30 bg-[#F1F8E9] py-2">
                    <Link to="/" className="underline underline-offset-4">Trang chủ</Link>
                    <span className="mx-1">/</span>
                    <Link to="/product" className="underline underline-offset-4">Sản phẩm</Link>
                    <span className="mx-1">/</span>
                    <span>{product?.name || "Chi tiết"}</span>
                </div>

                {/* Loading / Error */}
                {loading && (
                    <div className="text-center py-16">
                        <i className="fas fa-spinner fa-spin text-3xl text-[#237928]"></i>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="text-center py-16">
                        <i className="fas fa-exclamation-circle text-3xl text-red-500"></i>
                        <p className="mt-2 text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && product && (
                    <>
                        {/* Top section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
                            {/* Gallery */}
                            <div className="flex gap-8 items-start">
                                {/* Vertical navigation + thumbnails */}
                                <div className="flex flex-col items-center gap-4">
                                    <button className="w-24 h-12 rounded-md bg-[#DDEFD9] text-[#237928] shadow flex items-center justify-center">
                                        <i className="fas fa-caret-up text-xl"></i>
                                    </button>
                                    {[mainImg, product.images?.[0], product.images?.[1]]
                                        .filter(Boolean)
                                        .slice(0, 3)
                                        .map((src, idx) => (
                                            <button key={idx} className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow" onClick={() => { }}>
                                                <img src={src} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = placeholderImg; }} />
                                            </button>
                                        ))}
                                    <button className="w-24 h-12 rounded-md bg-[#DDEFD9] text-[#237928] shadow flex items-center justify-center">
                                        <i className="fas fa-caret-down text-xl"></i>
                                    </button>
                                </div>
                                {/* Main Image */}
                                <div className="w-[420px] h-[420px] rounded-full overflow-hidden p-4 shadow-md" style={{ backgroundColor: "rgba(46, 125, 50, 0.81)" }}>
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                                        <img src={mainImg} alt={product.name} className="w-full h-full object-cover object-center" onError={(e) => { e.currentTarget.src = placeholderImg; }} />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3">
                                <h1 className="text-[32px] md:text-[40px] leading-tight font-semibold text-[#237928]">{product.name}</h1>
                                <div className="text-[#237928] text-sm font-light">Loại: {product.categoryName || 'Sản phẩm'} | SKU: {String(product.pid || '0001').toString()}</div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star text-sm ${i < Math.floor(product.rating || 0) ? "text-[#FFB800]" : "text-gray-300"}`}></i>
                                        ))}
                                        <span className="text-sm text-[#237928] font-medium">{product.rating?.toFixed?.(1) || (product.rating || 0)}/5</span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <div className="text-sm text-black font-medium">Đã bán {product.reviews}</div>
                                </div>
                                <div className="text-[32px] md:text-[36px] font-bold text-[#D32F2F]">{(product.price || 0).toLocaleString('vi-VN')}đ</div>

                                {/* Size options */}
                                <div>
                                    <div className="text-[#237928] text-base mb-1.5">Kích cỡ</div>
                                    <div className="flex items-center gap-3">
                                        {sizeOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSelectedSize(opt.value)}
                                                className={`px-4 py-1.5 rounded-full text-sm border ${selectedSize === opt.value ? "bg-[#237928] text-white border-[#237928]" : "bg-white text-[#237928] border-[#237928]"}`}
                                            >{opt.label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <div className="text-[#237928] text-base mb-1.5">Số lượng</div>
                                    <div className="flex items-center">
                                        <div className="px-3 py-1.5 bg-white rounded-full shadow inline-flex items-center gap-4">
                                            <button className="text-xl text-[#237928]" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                                            <span className="text-lg min-w-[24px] text-center">{qty}</span>
                                            <button className="text-xl text-[#237928]" onClick={() => setQty(qty + 1)}>＋</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 pt-2">
                                    <button className="px-6 h-12 rounded-[40px] bg-white text-[#237928] border-2 border-[#4CAF50] text-lg font-medium hover:bg-[#EAF7EA]" onClick={handleAddToCart}>Thêm vào giỏ</button>
                                    <button className="px-8 h-12 rounded-[40px] bg-[#5DA56D] text-white text-lg font-semibold hover:bg-[#4C915C]" onClick={async () => {
                                        if (!isAuthenticated()) {
                                            alert("Vui lòng đăng nhập để thanh toán");
                                            navigate('/login');
                                            return;
                                        }
                                        
                                        if (!product?.pid) {
                                            alert("Không tìm thấy thông tin sản phẩm");
                                            return;
                                        }

                                        try {
                                            // Xóa giỏ hàng hiện tại để chỉ thanh toán sản phẩm này
                                            await clearCart();
                                            // Thêm sản phẩm này vào giỏ hàng
                                            await addToCart(product.pid, qty);
                                            // Điều hướng đến checkout
                                            navigate('/checkout');
                                        } catch (error) {
                                            const errorMessage = error?.body?.message || error?.message || "Không thể thêm vào giỏ hàng";
                                            alert(errorMessage);
                                            console.error("Error adding to cart:", error);
                                        }
                                    }}>Thanh toán</button>
                                </div>
                            </div>
                        </div>

                        {/* Description + Reviews header row */}
                        <div className="mt-12">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                                <button
                                    className={`flex items-center w-full md:w-auto gap-4 text-left ${activeSection === "detail" ? "text-[#1F6A2F]" : "text-[#6C8D64]"}`}
                                    onClick={() => setActiveSection("detail")}
                                >
                                    <h2 className="text-xl md:text-2xl font-semibold whitespace-nowrap">Mô Tả Sản Phẩm</h2>
                                </button>
                                <button
                                    className={`text-lg md:text-xl font-semibold whitespace-nowrap flex items-center gap-2 ${activeSection === "reviews" ? "text-[#1F6A2F]" : "text-[#6C8D64]"}`}
                                    onClick={() => {
                                        setActiveSection("reviews");
                                        handleScrollToReviews();
                                    }}
                                >
                                    Đánh Giá và Nhận Xét
                                    {/* <i className="fas fa-chevron-right text-sm"></i> */}
                                </button>
                            </div>
                            <div className="w-full h-[2px] bg-[#5DA56D] opacity-80 mb-6"></div>

                            {/* Description body */}

                            {activeSection === "detail" && (
                                hasDescription ? (
                                    <div className="text-[#2F6B3A] text-base md:text-lg leading-7 space-y-4">
                                        <p>{product.description}</p>
                                    </div>
                                ) : (
                                    <div className="text-sm md:text-base text-gray-600">Không có mô tả sản phẩm.</div>
                                )
                            )}
                        </div>

                        {/* Reviews section anchor + chips */}
                        {activeSection === "reviews" && (
                            <div ref={reviewsRef} className="mt-6">
                                <div className="flex items-center gap-3 flex-wrap justify-end mb-4">
                                    {/* Filter dropdown */}
                                    <div className="relative">
                                        <button
                                            className="px-4 py-2 rounded-full bg-[#F1F1F1] text-[#237928] border border-transparent text-sm md:text-base hover:bg-[#E5E5E5] transition-colors"
                                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                                        >
                                            <i className="fas fa-sliders-h mr-2"></i>
                                            Bộ lọc
                                            {filterRating && <span className="ml-1">({filterRating}★)</span>}
                                        </button>
                                        {showFilterMenu && (
                                            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm ${!filterRating ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setFilterRating(null);
                                                        setShowFilterMenu(false);
                                                    }}
                                                >
                                                    Tất cả đánh giá
                                                </button>
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <button
                                                        key={star}
                                                        className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm flex items-center gap-2 ${filterRating === star ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                        onClick={() => {
                                                            setFilterRating(star);
                                                            setShowFilterMenu(false);
                                                        }}
                                                    >
                                                        <span>{star}</span>
                                                        <div className="flex items-center">
                                                            {Array.from({ length: star }).map((_, i) => (
                                                                <i key={i} className="fas fa-star text-xs text-[#FFAE00]"></i>
                                                            ))}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort dropdown */}
                                    <div className="relative">
                                        <button
                                            className="px-4 py-2 rounded-full bg-[#EDEDED] text-[#237928] border border-transparent text-sm md:text-base flex items-center gap-2 hover:bg-[#E0E0E0] transition-colors"
                                            onClick={() => setShowSortMenu(!showSortMenu)}
                                        >
                                            {sortBy === "latest" && "Gần nhất"}
                                            {sortBy === "oldest" && "Cũ nhất"}
                                            {sortBy === "highest" && "Đánh giá cao"}
                                            {sortBy === "lowest" && "Đánh giá thấp"}
                                            <i className="fas fa-chevron-down"></i>
                                        </button>
                                        {showSortMenu && (
                                            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-44 z-10">
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm ${sortBy === 'latest' ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('latest');
                                                        setShowSortMenu(false);
                                                    }}
                                                >
                                                    Gần nhất
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm ${sortBy === 'oldest' ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('oldest');
                                                        setShowSortMenu(false);
                                                    }}
                                                >
                                                    Cũ nhất
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm ${sortBy === 'highest' ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('highest');
                                                        setShowSortMenu(false);
                                                    }}
                                                >
                                                    Đánh giá cao
                                                </button>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#F1F8E9] text-sm ${sortBy === 'lowest' ? 'text-[#237928] font-semibold' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setSortBy('lowest');
                                                        setShowSortMenu(false);
                                                    }}
                                                >
                                                    Đánh giá thấp
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="px-5 py-2 rounded-full bg-[#67A56C] text-white border border-transparent text-sm md:text-base hover:bg-[#5A9460] transition-colors"
                                        onClick={() => {
                                            setShowReviewForm(true);
                                            setActiveSection("reviews");
                                            setTimeout(() => reviewsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                                        }}
                                    >
                                        Nhận xét
                                    </button>
                                </div>

                                <h3 className="text-lg md:text-xl font-semibold text-[#2F6B3A] mb-3">Các Đánh Giá ({(reviews?.length || 0).toLocaleString('vi-VN')})</h3>

                                {showReviewForm ? (
                                    <div className="bg-white/70 rounded-2xl p-6 border border-[#9AC49F]">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-semibold text-[#237928]">Viết đánh giá</h4>
                                            <button
                                                className="text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowReviewForm(false)}
                                            >
                                                <i className="fas fa-times text-xl"></i>
                                            </button>
                                        </div>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!reviewRating) {
                                                alert("Vui lòng chọn đánh giá sao!");
                                                return;
                                            }
                                            if (!reviewName.trim() || !reviewEmail.trim() || !reviewComment.trim()) {
                                                alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
                                                return;
                                            }
                                            const newReview = {
                                                rating: reviewRating,
                                                name: reviewName,
                                                text: reviewComment,
                                                title: reviewTitle,
                                                email: reviewEmail,
                                                date: new Date().toISOString(),
                                            };
                                            // Update state immediately so it shows up
                                            setReviews((prev) => [newReview, ...(prev || [])]);
                                            // Persist to localStorage by product id
                                            try {
                                                const key = `reviews:${pid}`;
                                                const raw = localStorage.getItem(key);
                                                const arr = raw ? JSON.parse(raw) : [];
                                                arr.unshift(newReview);
                                                localStorage.setItem(key, JSON.stringify(arr));
                                            } catch (_) { }
                                            // Ensure it is visible even if list is full
                                            setVisibleReviewCount((c) => c + 1);
                                            alert("Cảm ơn bạn đã đánh giá!");
                                            setShowReviewForm(false);
                                            setReviewRating(0);
                                            setReviewName("");
                                            setReviewEmail("");
                                            setReviewTitle("");
                                            setReviewComment("");
                                            reviewFiles.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
                                            setReviewFiles([]);
                                            setSaveInfo(false);
                                        }}>
                                            {/* Rating */}
                                            <div className="mb-4">
                                                <label className="block text-sm text-[#2F6B3A] mb-2">
                                                    Đánh giá <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            className="focus:outline-none"
                                                            onClick={() => setReviewRating(i + 1)}
                                                            onMouseEnter={() => setHoverRating(i + 1)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        >
                                                            <i
                                                                className={`fas fa-star text-2xl ${i < (hoverRating || reviewRating) ? "text-[#FFAE00]" : "text-gray-300"
                                                                    }`}
                                                            ></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Name and Email row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={reviewName}
                                                        onChange={(e) => setReviewName(e.target.value)}
                                                        className="w-full px-4 py-2 rounded-full border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928]"
                                                        placeholder="Tên *"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="email"
                                                        value={reviewEmail}
                                                        onChange={(e) => setReviewEmail(e.target.value)}
                                                        className="w-full px-4 py-2 rounded-full border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928]"
                                                        placeholder="Email *"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    value={reviewTitle}
                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-full border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928]"
                                                    placeholder="Tiêu đề"
                                                />
                                            </div>

                                            {/* Comment */}
                                            <div className="mb-4">
                                                <textarea
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    rows={5}
                                                    className="w-full px-4 py-3 rounded-2xl border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928] resize-none"
                                                    placeholder="Nhận xét *"
                                                    required
                                                ></textarea>
                                            </div>

                                            {/* File upload */}
                                            <div className="mb-4">
                                                <label className="block text-sm text-[#2F6B3A] mb-2">
                                                    <i className="fas fa-paperclip mr-2"></i>
                                                    Đính kèm tệp
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="review-file-input"
                                                />
                                                <label
                                                    htmlFor="review-file-input"
                                                    className="inline-block px-6 py-2 rounded-full border-2 border-[#67A56C] text-[#237928] bg-white hover:bg-[#F1F8E9] transition-colors cursor-pointer"
                                                >
                                                    <i className="fas fa-upload mr-2"></i>
                                                    Chọn tệp
                                                </label>
                                                <span className="ml-3 text-sm text-gray-500">Hỗ trợ: Ảnh, Video, PDF, Word</span>

                                                {/* File preview */}
                                                {reviewFiles.length > 0 && (
                                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {reviewFiles.map((file, idx) => (
                                                            <div key={idx} className="relative border border-[#9AC49F] rounded-lg p-2 bg-white">
                                                                {file.preview ? (
                                                                    <img
                                                                        src={file.preview}
                                                                        alt={file.name}
                                                                        className="w-full h-24 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded">
                                                                        <i className="fas fa-file text-3xl text-gray-400"></i>
                                                                    </div>
                                                                )}
                                                                <div className="mt-1 text-xs text-gray-600 truncate" title={file.name}>
                                                                    {file.name}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    {(file.size / 1024).toFixed(1)} KB
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(idx)}
                                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                                                                >
                                                                    <i className="fas fa-times text-xs"></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Save info checkbox */}
                                            <div className="mb-4">
                                                <label className="flex items-start gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={saveInfo}
                                                        onChange={(e) => setSaveInfo(e.target.checked)}
                                                        className="mt-1"
                                                    />
                                                    <span className="text-sm text-[#2F6B3A]">
                                                        Lưu tên, email và trang web của tôi trong trình duyệt này cho lần bình luận tiếp theo.
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="flex-1 py-2.5 rounded-full border-2 border-[#237928] text-[#237928] bg-white hover:bg-gray-50 transition-colors font-semibold"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-2.5 rounded-full bg-[#67A56C] text-white font-semibold hover:bg-[#5A9460] transition-colors"
                                                >
                                                    Đăng Nhận Xét
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : reviewsLoading ? (
                                    <div className="text-sm text-gray-600">Đang tải nhận xét...</div>
                                ) : reviewsError ? (
                                    <div className="text-sm md:text-base text-gray-600">Không có nhận xét.</div>
                                ) : filteredAndSortedReviews.length === 0 ? (
                                    <div className="text-sm md:text-base text-gray-600">
                                        {filterRating ? `Không có nhận xét ${filterRating} sao.` : "Không có nhận xét."}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {displayedReviews.map((rev, idx) => (
                                            <div key={idx} className="rounded-xl border border-[#9AC49F] bg-white/70 p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-1 text-[#FFA500]">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <i
                                                                key={i}
                                                                className={`fas fa-star text-sm ${i < Math.round(rev.rating || 0) ? "text-[#FFAE00]" : "text-gray-300"}`}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[#2F6B3A] mb-2">
                                                    <span className="font-semibold">{rev.name || rev.user || "Ẩn danh"}</span>
                                                    {rev.location && <><span>•</span><span>{rev.location}</span></>}
                                                </div>
                                                <p className="text-sm text-[#2F6B3A] leading-6 mb-3">{rev.text || rev.content || ""}</p>
                                                {rev.date && <div className="text-xs text-gray-500">{rev.date}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!showReviewForm && !reviewsLoading && !reviewsError && displayedReviews.length < filteredAndSortedReviews.length && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => setVisibleReviewCount((c) => c + 6)}
                                            className="px-6 py-2 rounded-full bg-white border border-[#6DAF6F] text-[#2F6B3A] hover:bg-[#EAF7EA]"
                                        >
                                            Tải thêm
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Related */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-semibold text-[#237928] text-center mb-6">Sản phẩm liên quan</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 md:gap-20 lg:gap-24 gap-y-24 md:gap-y-28 pt-8">
                                {related.map((p) => (
                                    <div
                                        key={p.pid}
                                        className="rounded-3xl pt-6 pb-6 px-6 transition-all duration-300 hover:-translate-y-1 overflow-visible relative mt-28 w-60 mx-auto cursor-pointer"
                                        style={{ backgroundColor: "rgba(255,255,255,0.5)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}
                                        onClick={() => navigate(`/product/${p.pid}`)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/product/${p.pid}`); }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Xem chi tiết ${p.name}`}
                                    >
                                        <div className="flex justify-center mb-4 -mt-28">
                                            <Link to={`/product/${p.pid}`} className="w-44 h-44 rounded-full overflow-hidden p-2.5 shadow-md" style={{ backgroundColor: "rgba(46,125,50,0.81)" }}>
                                                <div className="w-full h-full rounded-full overflow-hidden bg-[#F9FBF7] flex items-center justify-center">
                                                    <img
                                                        src={p.thumbnail || p.images?.[0] || placeholderImg}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover object-center"
                                                        onError={(e) => { e.currentTarget.src = placeholderImg; }}
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                        <h4 className="text-center text-lg font-semibold text-[#237928] mb-2">{p.name}</h4>
                                        {/* Rating row to match listing cards */}
                                        <div className="flex items-center justify-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`fas fa-star text-base ${i < Math.floor(p.rating || 0) ? 'text-[#FFB800]' : 'text-gray-300'}`}
                                                ></i>
                                            ))}
                                            <span className="text-xs text-gray-600 ml-1 font-medium">({p.reviews || '0'})</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="px-4 py-2 text-[#3D5B2E] rounded-full text-sm font-semibold shadow-[inset_0_0_0_2px_#4A9F67]">{(p.price || 0).toLocaleString('vi-VN')}</span>
                                            <Link to={`/product/${p.pid}`} className="px-5 py-2 bg-[#91EAAF] text-black rounded-full text-sm font-semibold hover:bg-[#4CAF50] transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
                                                Mua ngay
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;