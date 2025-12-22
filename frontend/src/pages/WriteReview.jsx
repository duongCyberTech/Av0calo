import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import placeholderImg from "../assets/product-placeholder.svg";
import { fetchJSON } from "../utils/api";

const WriteReview = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);

    // Form state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);

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
                        sku: detailData.sku || detailData.pid
                    }
                    : null;
                setProduct(detail);

                // Fetch all for related
                const response = await fetchJSON("/products/all", { method: "GET" });
                const list = Array.isArray(response) ? response : response?.result || [];
                const transformed = list
                    .filter((p) => p.pid !== pid)
                    .slice(0, 5)
                    .map((p) => ({
                        pid: p.pid,
                        name: p.title,
                        price: p.sell_price || p.price || 0,
                        thumbnail: p.thumbnail || null,
                        images: p.thumbnail ? [p.thumbnail] : []
                    }));
                setRelated(transformed);
            } catch (err) {
                setError(err?.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [pid]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) {
            alert("Vui lòng chọn đánh giá sao!");
            return;
        }
        if (!name.trim() || !email.trim() || !comment.trim()) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            // Persist locally so ProductDetail can display immediately
            const newReview = {
                rating,
                name,
                text: comment,
                title,
                email,
                date: new Date().toISOString(),
            };
            try {
                const key = `reviews:${pid}`;
                const raw = localStorage.getItem(key);
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift(newReview);
                localStorage.setItem(key, JSON.stringify(arr));
            } catch (err) { console.warn(err); }

            alert("Cảm ơn bạn đã đánh giá!");
            navigate(`/product/${pid}`);
        } catch (err) {
            console.warn(err);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F1F8E9]">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-[#237928]">Đang tải...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#F1F8E9]">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p className="text-red-600">{error || "Không tìm thấy sản phẩm"}</p>
                </div>
                <Footer />
            </div>
        );
    }

    const mainImg = product?.thumbnail || product?.images?.[0] || placeholderImg;

    return (
        <div className="min-h-screen bg-[#F1F8E9]">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="text-sm text-[#2F6B3A] mb-6">
                    <Link to="/" className="hover:underline">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <Link to="/products" className="hover:underline">Sản phẩm</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold">{product.name}</span>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Product info */}
                    <div className="bg-white/50 rounded-3xl p-8">
                        <div className="flex flex-col items-center">
                            {/* Product image */}
                            <div className="w-80 h-80 rounded-full overflow-hidden p-3 shadow-lg mb-6" style={{ backgroundColor: "rgba(46,125,50,0.81)" }}>
                                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                                    <img
                                        src={mainImg}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => { e.currentTarget.src = placeholderImg; }}
                                    />
                                </div>
                            </div>

                            {/* Product details */}
                            <h1 className="text-3xl font-bold text-[#237928] mb-2 text-center">{product.name}</h1>
                            <div className="text-sm text-[#6C8D64] mb-2">
                                <span>Loại: {product.categoryName || "Dầu ăn"}</span>
                                <span className="mx-2">|</span>
                                <span>SKU: {product.sku || "0001"}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <i
                                            key={i}
                                            className={`fas fa-star text-lg ${i < Math.round(product.rating) ? "text-[#FFAE00]" : "text-gray-300"}`}
                                        ></i>
                                    ))}
                                </div>
                                <span className="text-sm text-[#237928] font-semibold">{product.rating || 0}/5</span>
                            </div>

                            {/* Sold count */}
                            <div className="text-sm text-[#6C8D64] mb-4">Đã bán {product.reviews}</div>

                            {/* Price */}
                            <div className="text-4xl font-bold text-[#237928] mb-6">{product.price.toLocaleString('vi-VN')}đ</div>

                            {/* Size options */}
                            <div className="mb-4">
                                <div className="text-sm text-[#2F6B3A] mb-2 font-semibold">Kích cỡ</div>
                                <div className="flex gap-3">
                                    {["30ml", "100ml", "300ml"].map((size) => (
                                        <button
                                            key={size}
                                            className="px-6 py-2 rounded-full border-2 border-[#237928] text-[#237928] bg-white hover:bg-[#237928] hover:text-white transition-colors"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <div className="text-sm text-[#2F6B3A] mb-2 font-semibold">Số lượng</div>
                                <div className="flex items-center gap-3">
                                    <button className="w-8 h-8 rounded-full bg-[#237928] text-white flex items-center justify-center">-</button>
                                    <span className="min-w-[24px] text-center">1</span>
                                    <button className="w-8 h-8 rounded-full bg-[#237928] text-white flex items-center justify-center">+</button>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 w-full">
                                <button className="flex-1 px-8 py-3 rounded-full border-2 border-[#237928] text-[#237928] bg-white hover:bg-[#237928] hover:text-white transition-colors font-semibold">
                                    Thêm vào giỏ
                                </button>
                                <button className="flex-1 px-8 py-3 rounded-full bg-[#237928] text-white hover:bg-[#1F6A2F] transition-colors font-semibold">
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Review form */}
                    <div className="bg-white/50 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-[#237928] mb-6">Nhận xét</h2>

                        <form onSubmit={handleSubmit}>
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
                                            onClick={() => setRating(i + 1)}
                                            onMouseEnter={() => setHoverRating(i + 1)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        >
                                            <i
                                                className={`fas fa-star text-2xl ${i < (hoverRating || rating) ? "text-[#FFAE00]" : "text-gray-300"
                                                    }`}
                                            ></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name and Email row */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-[#2F6B3A] mb-2">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-full border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928]"
                                        placeholder="Tên *"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#2F6B3A] mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-full border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928]"
                                    placeholder="Tiêu đề"
                                />
                            </div>

                            {/* Comment */}
                            <div className="mb-4">
                                <label className="block text-sm text-[#2F6B3A] mb-2">
                                    Nhận xét <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-3xl border border-[#9AC49F] bg-[#E8F5E9] focus:outline-none focus:border-[#237928] resize-none"
                                    placeholder="Nhận xét *"
                                    required
                                ></textarea>
                            </div>

                            {/* Save info checkbox */}
                            <div className="mb-6">
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

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-full bg-[#67A56C] text-white font-semibold hover:bg-[#5A9460] transition-colors"
                            >
                                Bình Luận
                            </button>
                        </form>
                    </div>
                </div>

                {/* Related products */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-[#237928] text-center mb-6">Sản phẩm liên quan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {related.map((p) => (
                            <div
                                key={p.pid}
                                className="rounded-3xl pt-6 pb-6 px-6 transition-all hover:-translate-y-1 overflow-visible relative mt-24 w-60 mx-auto"
                                style={{ backgroundColor: "rgba(255,255,255,0.5)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" }}
                            >
                                <div className="flex justify-center mb-4 -mt-24">
                                    <div className="w-36 h-36 rounded-full overflow-hidden p-2.5 shadow-md" style={{ backgroundColor: "rgba(46,125,50,0.81)" }}>
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                                            <img
                                                src={p.thumbnail || p.images?.[0] || placeholderImg}
                                                alt={p.name}
                                                className="w-full h-full object-cover object-center"
                                                onError={(e) => { e.currentTarget.src = placeholderImg; }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-center text-lg font-semibold text-[#237928] mb-2">{p.name}</h4>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="px-4 py-1 text-[#3D5B2E] rounded-full text-sm font-semibold shadow-[inset_0_0_0_2px_#4A9F67]">
                                        {(p.price || 0).toLocaleString('vi-VN')}
                                    </span>
                                    <Link
                                        to={`/product/${p.pid}`}
                                        className="px-4 py-1 bg-[#91EAAF] text-black rounded-full text-sm font-semibold hover:bg-[#4CAF50] transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Mua ngay
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default WriteReview;