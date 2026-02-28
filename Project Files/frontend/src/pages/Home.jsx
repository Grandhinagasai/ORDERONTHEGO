import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import "../styles/Home.css";

const categoryIcons = {
    Soups: "🍲", Breads: "🍞", "Main Course": "🍛", Desserts: "🍰",
    Beverages: "🥤", Snacks: "🍟", Salads: "🥗", Biryani: "🍚",
    Pizza: "🍕", Burgers: "🍔",
};

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foodsRes, restRes, catRes] = await Promise.all([
                    API.get("/foods"),
                    API.get("/restaurants"),
                    API.get("/foods/categories"),
                ]);
                setFoods(foodsRes.data);
                setRestaurants(restRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="page-enter">
            <section className="home-hero">
                <div className="home-hero-content">
                    <div className="hero-text">
                        <h1>
                            Delicious Food,<br />
                            <span className="highlight">Delivered Fast</span>
                        </h1>
                        <p>
                            Order your favorite meals from the best local restaurants.
                            Fresh, hot, and delivered right to your doorstep — anytime, anywhere.
                        </p>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Explore Menu <FiArrowRight />
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-lg">
                                Join Now
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <div className="number">500+</div>
                                <div className="label">Food Items</div>
                            </div>
                            <div className="hero-stat">
                                <div className="number">50+</div>
                                <div className="label">Restaurants</div>
                            </div>
                            <div className="hero-stat">
                                <div className="number">10K+</div>
                                <div className="label">Happy Customers</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
                            alt="Delicious Food"
                        />
                    </div>
                </div>
            </section>

            <section className="home-section container">
                <div className="section-header">
                    <h2>Browse <span className="accent">Categories</span></h2>
                    <Link to="/products" className="btn btn-outline btn-sm">
                        View All <FiArrowRight />
                    </Link>
                </div>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            className="category-card"
                            onClick={() => navigate(`/products?category=${cat}`)}
                        >
                            <span className="category-icon">{categoryIcons[cat] || "🍽️"}</span>
                            <span>{cat}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-section container">
                <div className="section-header">
                    <h2>Popular <span className="accent">Dishes</span></h2>
                    <Link to="/products" className="btn btn-outline btn-sm">
                        See All <FiArrowRight />
                    </Link>
                </div>
                <div className="products-grid">
                    {foods.slice(0, 8).map((food) => (
                        <ProductCard key={food._id} food={food} />
                    ))}
                </div>
            </section>

            {restaurants.length > 0 && (
                <section className="home-section container">
                    <div className="section-header">
                        <h2>Top <span className="accent">Restaurants</span></h2>
                    </div>
                    <div className="restaurants-grid">
                        {restaurants.map((r) => (
                            <div
                                key={r._id}
                                className="restaurant-card"
                                onClick={() => navigate(`/products?restaurant=${r._id}`)}
                            >
                                <img src={r.mainImg} alt={r.title} className="restaurant-card-img" />
                                <div className="restaurant-card-body">
                                    <h3>{r.title}</h3>
                                    <p>{r.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="home-section container">
                <div className="cta-section">
                    <h2>Hungry? Order Now!</h2>
                    <p>Get your favorite food delivered in minutes. Fresh, hot, and ready to enjoy.</p>
                    <Link to="/products" className="btn btn-lg">
                        Order Now <FiArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
