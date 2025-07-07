import React, { useEffect, useState } from "react";
import { FaChalkboard, FaUserFriends, FaCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const EducatorDashboardPage = () => {
  const [completedSessions, setCompletedSessions] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [completedRes, feedbackRes] = await Promise.all([
          axios.get("http://localhost:3001/api/educator/completed-events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/educator/feedbacks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCompletedSessions(completedRes.data.length || 0);
        setFeedbackCount(feedbackRes.data.length || 0);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">
        Welcome, Educator
      </h1>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <FaChalkboard className="text-4xl text-[#4E6766] mx-auto mb-3" />
          <h4 className="text-lg font-bold">
            {loading ? "..." : completedSessions} Sessions
          </h4>
          <p className="text-sm text-gray-500">Conducted This Month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <FaUserFriends className="text-4xl text-[#4E6766] mx-auto mb-3" />
          <h4 className="text-lg font-bold">250 Students</h4>
          <p className="text-sm text-gray-500">Attended Your Classes</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <FaCommentDots className="text-4xl text-[#4E6766] mx-auto mb-3" />
          <h4 className="text-lg font-bold">
            {loading ? "..." : feedbackCount} Feedbacks
          </h4>
          <p className="text-sm text-gray-500">From Recent Events</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-[#4E6766] mb-4">
          Upcoming Sessions
        </h2>
        <div className="bg-white p-6 rounded shadow text-gray-700">
          <p>
            No sessions scheduled.{" "}
            <Link to="/educator/sessions" className="underline text-[#4E6766]">
              Schedule one now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboardPage;
