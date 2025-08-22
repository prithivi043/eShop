// routes/AdminRoutes.jsx
import { Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageCustomers from "../pages/admin/ManageCustomers";
import ManageOrders from "../pages/admin/ManageOrders";
import BrandingSettings from "../pages/admin/BrandingSettings";

const AdminRoutes = [
  <Route index element={<Dashboard />} key="dashboard" />,
  <Route path="products" element={<ManageProducts />} key="admin-products" />,
  <Route path="customers" element={<ManageCustomers />} key="admin-customers" />,
  <Route path="orders" element={<ManageOrders />} key="admin-orders" />,
  <Route path="settings" element={<BrandingSettings />} key="branding-settings" />,
];

export default AdminRoutes;
