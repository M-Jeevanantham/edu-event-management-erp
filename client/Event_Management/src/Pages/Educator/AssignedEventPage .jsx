import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCheck, FaClipboardList, FaArrowLeft } from "react-icons/fa";

const AssignedEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [eventDetails, setEventDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("approval");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventRes, studentsRes, feedbacksRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/educator/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3001/api/educator/${eventId}/registered-students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/educator/feedbacks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setEventDetails(eventRes.data);
        setStudents(studentsRes.data.registeredStudents || []);
        setFeedbacks(
          feedbacksRes.data.filter((fb) => fb.eventId === eventId)
        );
      } catch (err) {
        console.error("Error loading event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const markAttendance = async (studentId, present) => {
    try {
      await axios.post(
        `http://localhost:3001/api/educator/${eventId}/attendance`,
        { studentId, present },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventDetails((prev) => {
        const updatedAttendance = [...prev.registeredStudentsAttendance];
        const index = updatedAttendance.findIndex(
          (entry) =>
            entry.student === studentId || entry.student._id === studentId
        );

        if (index === -1) {
          updatedAttendance.push({ student: studentId, present });
        } else {
          updatedAttendance[index].present = present;
        }

        return { ...prev, registeredStudentsAttendance: updatedAttendance };
      });

      alert(`Marked ${present ? "Present" : "Absent"}`);
    } catch (err) {
      console.error("Error marking attendance", err);
    }
  };

  const approveRegistration = async (studentId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/educator/approved-student/${eventId}`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, status: "Approved" } : s
        )
      );
    } catch (err) {
      console.error("Error approving student:", err);
    }
  };

  const rejectRegistration = (studentId) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId ? { ...s, status: "Rejected" } : s
      )
    );
  };

  const completeEvent = async () => {
    try {
      const feedbacksPayload = students
        .filter((s) => s.status === "Approved")
        .map((student) => ({
          student: student._id,
          rating: 5,
          comment: "Great session!" // You can collect this from a form later
        }));

      const res = await axios.post(
        "http://localhost:3001/api/educator/event/complete",
        {
          eventId,
          feedbacks: feedbacksPayload,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Event marked as completed!");
      navigate(-1);
    } catch (err) {
      console.error("Error completing event:", err);
      alert("❌ Failed to complete the event.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!eventDetails) return <p>Event not found.</p>;

  const attendanceMap = new Map(
    (eventDetails.registeredStudentsAttendance || []).map((entry) => [
      typeof entry.student === "object" ? entry.student._id : entry.student,
      entry.present,
    ])
  );

  return (
    <div className="text-gray-800 p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4E6766] border border-[#4E6766] px-4 py-2 rounded mb-4 hover:bg-[#4E6766] hover:text-white transition-all"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="flex gap-4 mb-6">
        <div
          onClick={() => setView("approval")}
          className={`cursor-pointer bg-[#F0EDEE] border-2 border-[#4E6766] rounded-xl p-4 w-1/2 text-center transition-all ${
            view === "approval" && "ring-2 ring-[#4E6766]"
          }`}
        >
          <FaUserCheck size={32} className="text-[#4E6766] mb-2" />
          <h2 className="text-lg font-semibold text-[#4E6766]">
            Approve Registrations
          </h2>
        </div>
        <div
          onClick={() => setView("attendance")}
          className={`cursor-pointer bg-[#F0EDEE] border-2 border-[#4E6766] rounded-xl p-4 w-1/2 text-center transition-all ${
            view === "attendance" && "ring-2 ring-[#4E6766]"
          }`}
        >
          <FaClipboardList size={32} className="text-[#4E6766] mb-2" />
          <h2 className="text-lg font-semibold text-[#4E6766]">Mark Attendance</h2>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#4E6766]">{eventDetails.title}</h1>
        <p>Date: {new Date(eventDetails.date).toLocaleDateString()}</p>
        <p>Time: {eventDetails.time}</p>
        <p>Location: {eventDetails.location}</p>
        <p>Status: <strong>{eventDetails.status}</strong></p>
      </div>

      {view === "approval" && (
        <>
          <h2 className="text-xl font-semibold mb-3 text-[#4E6766]">Registration Approvals</h2>
          <ul className="space-y-3">
            {students.map((student) => (
              <li key={student._id} className="flex justify-between items-center border border-[#4E6766] p-3 rounded">
                <span className="font-medium">{student.name}</span>
                {student.status === "Approved" ? (
                  <span className="text-green-600 font-semibold">Approved</span>
                ) : student.status === "Rejected" ? (
                  <span className="text-red-500 font-semibold">Rejected</span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveRegistration(student._id)}
                      className="bg-[#4E6766] text-white px-3 py-1 rounded hover:bg-[#3a5150]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectRegistration(student._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "attendance" && (
        <>
          <h2 className="text-xl font-semibold mb-3 text-[#4E6766]">Mark Attendance</h2>
          <ul className="space-y-3">
            {students
              .filter((s) => s.status === "Approved")
              .map((student) => {
                const isMarked = attendanceMap.has(student._id);
                const isPresent = attendanceMap.get(student._id);

                return (
                  <li
                    key={student._id}
                    className="flex justify-between items-center border border-[#4E6766] p-3 rounded"
                  >
                    <span>{student.name}</span>
                    {isMarked ? (
                      <span
                        className={`font-bold px-3 py-1 rounded ${
                          isPresent
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {isPresent ? "Present" : "Absent"}
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAttendance(student._id, true)}
                          className="bg-[#4E6766] text-white px-3 py-1 rounded hover:bg-[#3a5150]"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(student._id, false)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Absent
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3 text-[#4E6766]">Feedbacks</h2>
        <div className="space-y-3">
          {feedbacks.length === 0 ? (
            <p>No feedbacks yet.</p>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-4 border border-[#4E6766] rounded shadow-sm"
              >
                <p className="font-semibold">{fb.studentName}</p>
                <p className="text-sm text-gray-500">{fb.date}</p>
                <p>{fb.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Event Completion Button */}
      <div className="mt-6 text-center">
        <button
          onClick={completeEvent}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Mark Event as Completed
        </button>
      </div>
    </div>
  );
};

export default AssignedEventPage;
