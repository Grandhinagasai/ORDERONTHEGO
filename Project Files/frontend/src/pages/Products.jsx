import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import "../styles/Products.css";

const Products = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const params = {};
                if (activeCategory) params.category = activeCategory;
                if (searchQuery) params.search = searchQuery;
                if (sortBy) params.sort = sortBy;
                if (searchParams.get("restaurant")) params.restaurant = searchParams.get("restaurant");

                const [foodsRes, catRes] = await Promise.all([
                    API.get("/foods", { params }),
                    API.get("/foods/categories"),
                ]);
                setFoods(foodsRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategory, searchQuery, sortBy, searchParams]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    if (loading) return <Loader />;

    return (
        <div className="products-page container page-enter">
            <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
                Our <span style={{ color: "var(--primary)" }}>Menu</span>
            </h1>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
                Discover delicious dishes from our partner restaurants
            </p>

            <div className="products-toolbar">
                <div className="products-search">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search dishes, restaurants..."
                        value={searchQuery}
                        onChange={(e) => updateFilter("search", e.target.value)}
                    />
                </div>
                <div className="products-sort">
                    <select value={sortBy} onChange={(e) => updateFilter("sort", e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            <div className="products-filter-bar">
                <button
                    className={`filter-chip ${!activeCategory ? "active" : ""}`}
                    onClick={() => updateFilter("category", "")}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => updateFilter("category", cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <p className="products-count">{foods.length} dishes found</p>

            {foods.length === 0 ? (
                <div className="no-products">
                    <h3>No dishes found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="products-grid">
                    {foods.map((food) => (
                        <ProductCard key={food._id} food={food} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
