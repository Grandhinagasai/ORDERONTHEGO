import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

import Cart from "./pages/customer/Cart";
import Profile from "./pages/customer/Profile";
import CategoryProducts from "./pages/customer/CategoryProducts";
import IndividualRestaurant from "./pages/customer/IndividualRestaurant";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";

import Admin from "./pages/admin/Admin";
import AllOrders from "./pages/admin/AllOrders";
import AllProducts from "./pages/admin/AllProducts";
import AllUsers from "./pages/admin/AllUsers";
import AllRestaurants from "./pages/admin/AllRestaurants";

import RestaurantHome from "./pages/restaurant/RestaurantHome";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import NewProduct from "./pages/restaurant/NewProduct";
import EditProduct from "./pages/restaurant/EditProduct";
import RestaurantOrders from "./pages/restaurant/RestaurantOrders";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A2E",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              },
            }}
          />
          <Navbar />
          <main style={{ minHeight: "100vh" }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:category" element={<CategoryProducts />} />
              <Route path="/view-restaurant/:id" element={<IndividualRestaurant />} />

              {/* Customer Routes */}
              <Route path="/cart" element={
                <ProtectedRoute roles={["customer"]}>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute roles={["customer"]}>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation" element={
                <ProtectedRoute roles={["customer"]}>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute roles={["customer"]}>
                  <MyOrders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={["admin"]}>
                  <AllUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute roles={["admin"]}>
                  <AllOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute roles={["admin"]}>
                  <AllProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/restaurants" element={
                <ProtectedRoute roles={["admin"]}>
                  <AllRestaurants />
                </ProtectedRoute>
              } />

              {/* Restaurant Routes */}
              <Route path="/restaurant" element={
                <ProtectedRoute roles={["restaurant"]}>
                  <RestaurantHome />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/menu" element={
                <ProtectedRoute roles={["restaurant"]}>
                  <RestaurantMenu />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/new-product" element={
                <ProtectedRoute roles={["restaurant"]}>
                  <NewProduct />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/edit-product/:id" element={
                <ProtectedRoute roles={["restaurant"]}>
                  <EditProduct />
                </ProtectedRoute>
              } />
              <Route path="/restaurant/orders" element={
                <ProtectedRoute roles={["restaurant"]}>
                  <RestaurantOrders />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
