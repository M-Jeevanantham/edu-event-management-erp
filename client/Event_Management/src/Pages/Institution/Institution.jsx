import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardList,
  FaUniversity,
  FaUserTie,
} from "react-icons/fa";

const InstitutionLayout = () => {
  const location = useLocation();

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
        ? "bg-white text-[#4E6766] px-3 py-2 rounded"
        : "text-white hover:bg-white/10 px-3 py-2 rounded";
    }

    return location.pathname.startsWith(path)
      ? "bg-white text-[#4E6766] px-3 py-2 rounded"
      : "text-white hover:bg-white/10 px-3 py-2 rounded";
  };

  return (
    <div className="min-h-screen flex bg-[#f0edee]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4E6766] text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Institution Panel</h2>

        <nav className="space-y-3 flex flex-col">
          <Link to="/institution" className={isActive("/institution", true)}>
            <div className="flex items-center gap-2">
              <FaClipboardList />
              Dashboard
            </div>
          </Link>

          <Link to="/institution/events" className={isActive("/institution/events")}>
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              Manage Events
            </div>
          </Link>

          <Link to="/institution/event-requests" className={isActive("/institution/event-requests")}>
            <div className="flex items-center gap-2">
              <FaClipboardList />
              Event Requests
            </div>
          </Link>

          <Link to="/institution/resources" className={isActive("/institution/resources")}>
            <div className="flex items-center gap-2">
              <FaChalkboardTeacher />
              Resource
            </div>
          </Link>

          <Link to="/institution/educators" className={isActive("/institution/educators")}>
            <div className="flex items-center gap-2">
              <FaUserTie />
              Educators
            </div>
          </Link>

          <Link to="/institution/profile" className={isActive("/institution/profile")}>
            <div className="flex items-center gap-2">
              <FaUniversity />
              Institution Profile
            </div>
          </Link>
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-10 border-t border-white/20">
          <Link to="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Routed Page Outlet */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default InstitutionLayout;
