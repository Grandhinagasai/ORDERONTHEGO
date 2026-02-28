import { Link } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3><MdRestaurantMenu style={{ verticalAlign: "middle" }} /> NS Foods</h3>
                    <p>
                        Your on-demand food ordering solution. Discover, order, and enjoy
                        delicious meals from the best restaurants, delivered right to your
                        doorstep.
                    </p>
                </div>
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/products">Menu</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/my-orders">My Orders</Link>
                </div>
                <div className="footer-col">
                    <h4>Categories</h4>
                    <Link to="/products?category=Pizza">Pizza</Link>
                    <Link to="/products?category=Burgers">Burgers</Link>
                    <Link to="/products?category=Biryani">Biryani</Link>
                    <Link to="/products?category=Desserts">Desserts</Link>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <Link to="#">Help Center</Link>
                    <Link to="#">Contact Us</Link>
                    <Link to="#">Terms of Service</Link>
                    <Link to="#">Privacy Policy</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} NS Foods — OrderOnTheGo. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
