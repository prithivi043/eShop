// routes/CustomerRoutes.jsx
import { Route } from "react-router-dom";
import Home from "../pages/customer/Home";
import ProductList from "../pages/customer/ProductList";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import OrderHistory from "../pages/customer/OrderHistory";
import Profile from "../pages/customer/Profile";
import Settings from "../pages/customer/Settings";

const CustomerRoutes = [
  <Route index element={<Home />} key="home" />,
  <Route path="products" element={<ProductList />} key="products" />,
  <Route path="products/:id" element={<ProductDetails />} key="product-details" />,
  <Route path="cart" element={<Cart />} key="cart" />,
  <Route path="orders" element={<OrderHistory />} key="orders" />,
  <Route path="profile" element={<Profile />} key="profile" />,
  <Route path="settings" element={<Settings />} key="settings" />,
];

export default CustomerRoutes;
