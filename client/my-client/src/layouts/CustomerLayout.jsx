import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/common/Navbar";


const CustomerLayout = () => {
  return (
    <div className="customer-portal">
      <CustomerNavbar />
      <main className="px-4 py-6 min-h-screen bg-gray-50">
        <Outlet /> {/* Page content will render here */}
      </main>

    </div>
  );
};

export default CustomerLayout;
