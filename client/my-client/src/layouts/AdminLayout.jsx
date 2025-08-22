import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/common/AdminSidebar";
import AdminHeader from "../components/common/AdminHeader";


const AdminLayout = () => {
  return (
    <div className="admin-dashboard flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />



        <main className="p-6 overflow-auto bg-gray-100 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
