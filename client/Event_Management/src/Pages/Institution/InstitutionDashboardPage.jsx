import React, { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaCalendarAlt,
  FaTools,
} from "react-icons/fa";
import axios from "axios";

const InstitutionDashboardPage = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    registeredStudents: 0,
    educators: 0,
    totalResources: 0,
  });

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [
          eventsRes,
          resourcesRes,
          resourceReqRes,
          eventReqRes,
        ] = await Promise.all([
          axios.get("http://localhost:3001/api/institution/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/resources", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/resource-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/event-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const events = eventsRes.data || [];
        const resources = resourcesRes.data.resources || resourcesRes.data || [];

        // Stats
        const regStudents = new Set();
        const educs = new Set();

        events.forEach((event) => {
          event.registeredStudents?.forEach((id) => regStudents.add(id));
          if (event.assignedEducator?.educator) {
            educs.add(event.assignedEducator.educator);
          }
        });

        setStats({
          totalEvents: events.length,
          registeredStudents: regStudents.size,
          educators: educs.size,
          totalResources: resources.length,
        });

        // Announcements from requests
        const resourceRequests = resourceReqRes.data.requests || resourceReqRes.data || [];
        const eventRequests = eventReqRes.data.requests || eventReqRes.data || [];

        const combinedMessages = [
          ...resourceRequests.map(
            (r) =>
              `🔧 ${r.educatorName} requested ${r.resourceName} for "${r.eventTitle}"`
          ),
          ...eventRequests.map(
            (r) => `📅 ${r.educatorName} requested to join event "${r.eventTitle}"`
          ),
        ];

        setAnnouncements([...new Set(combinedMessages)]);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">
        Institution Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <FaCalendarAlt className="text-4xl text-[#4E6766] mx-auto mb-2" />
          <h4 className="font-semibold text-lg">
            {stats.totalEvents} Events
          </h4>
          <p className="text-sm text-gray-600">Scheduled</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <FaUsers className="text-4xl text-[#4E6766] mx-auto mb-2" />
          <h4 className="font-semibold text-lg">
            {stats.registeredStudents} Students
          </h4>
          <p className="text-sm text-gray-600">Registered Participants</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <FaChalkboardTeacher className="text-4xl text-[#4E6766] mx-auto mb-2" />
          <h4 className="font-semibold text-lg">{stats.educators} Educators</h4>
          <p className="text-sm text-gray-600">Conducting Events</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
          <FaTools className="text-4xl text-[#4E6766] mx-auto mb-2" />
          <h4 className="font-semibold text-lg">{stats.totalResources} Resources</h4>
          <p className="text-sm text-gray-600">In Inventory</p>
        </div>
      </div>

      {/* Notices / Announcements */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-[#4E6766] mb-4">
          Announcements
        </h2>
        <div className="bg-white p-6 rounded-lg shadow text-gray-700">
          {announcements.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {announcements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No new requests or updates.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboardPage;
