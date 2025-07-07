import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const EducatorLayout = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white text-[#4E6766] font-semibold px-3 py-2 rounded"
      : "text-white hover:bg-white/10 px-3 py-2 rounded";

  return (
    <div className="min-h-screen flex bg-[#f0edee]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[#4E6766] text-white flex flex-col p-6 sticky top-0">
        <h2 className="text-2xl font-bold mb-8">Educator Panel</h2>
        <nav className="space-y-2 flex flex-col">
          <Link to="/educator" className={isActive("/educator")}>
            Dashboard
          </Link>
          <Link to="/educator/sessions" className={isActive("/educator/sessions")}>
            Manage Sessions
          </Link>
          <Link to="/educator/feedback" className={isActive("/educator/feedback")}>
            Feedback
          </Link>
          <Link to="/educator/profile" className={isActive("/educator/profile")}>
            Profile
          </Link>
        </nav>
        <div className="mt-auto pt-10 border-t border-white/20">
          <Link to="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Outlet Area */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EducatorLayout;
