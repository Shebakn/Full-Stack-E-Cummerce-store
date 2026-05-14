import { Outlet } from "react-router-dom";
import Header from "@/common/components/Header"; 
import Footer from "../common/components/Footer";


export const MainLayout = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};