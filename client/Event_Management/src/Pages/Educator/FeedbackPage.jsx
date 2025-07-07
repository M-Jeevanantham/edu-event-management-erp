import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/educator/feedbacks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">Session Feedback</h1>

      {loading ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedbacks available yet.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white shadow p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition"
            >
              <FaUserCircle className="text-4xl text-[#4E6766]" />
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">{fb.name}</h4>
                  <span className="text-sm text-gray-500">{new Date(fb.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Session: <span className="font-medium">{fb.session}</span>
                </p>
                <p className="text-gray-700">{fb.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
