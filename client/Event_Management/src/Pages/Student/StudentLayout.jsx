import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const StudentLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F0EDEE] text-gray-800 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-[#4E6766] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/student")}
        >
          EventHub
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/student")}
            className="hover:underline"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/student/request")}
            className="hover:underline"
          >
            Request Event
          </button>
          <button
            onClick={() => navigate("/student/dashBoard")}
            className="hover:underline"
          >
            My Requests
          </button>
          <button
            onClick={() => navigate("/student/profile")}
            className="hover:underline"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Outlet Area */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
