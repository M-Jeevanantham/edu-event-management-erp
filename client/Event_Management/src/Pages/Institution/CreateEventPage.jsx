import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
  });

  const [educators, setEducators] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedEducator, setSelectedEducator] = useState("");
  const [selectedResources, setSelectedResources] = useState({});

  // Load educators and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduRes, resRes] = await Promise.all([
          axios.get("http://localhost:3001/api/institution/educators", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/resources", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setEducators(eduRes.data);
        setResources(resRes.data.resources || resRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  // Prefill form from request
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;

      try {
        const res = await axios.get(`http://localhost:3001/api/institution/event-requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const request = res.data;
        setForm({
          title: request.title || "",
          description: request.description || "",
          date: request.preferredDate?.split("T")[0] || "",
          location: "",
          capacity: "",
        });

        const resourcePrefill = {};
        request.requestedResources?.forEach((r) => {
          if (r.resource?._id) {
            resourcePrefill[r.resource._id] = r.quantity;
          }
        });
        setSelectedResources(resourcePrefill);
      } catch (err) {
        console.error("Error fetching event request:", err);
      }
    };

    fetchRequestDetails();
  }, [requestId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || "" : value,
    }));
  };

  const handleResourceChange = (resourceId, quantity) => {
    setSelectedResources((prev) => ({
      ...prev,
      [resourceId]: parseInt(quantity) || "",
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.capacity || !form.description) {
      alert("❌ Please fill all required fields: title, date, capacity, description.");
      return;
    }

    try {
      const assignedResources = Object.entries(selectedResources)
        .filter(([_, qty]) => qty > 0)
        .map(([resourceId, quantity]) => ({
          resourceId,
          quantity,
        }));

      const payload = {
        ...form,
        educatorId: selectedEducator || null,
        assignedResources,
        fromRequestId: requestId || null,
      };

      await axios.post("http://localhost:3001/api/institution/events", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Event created successfully!");
      navigate("/institution/events");
    } catch (err) {
      console.error("Error creating event", err);
      alert("❌ Something went wrong while creating the event.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-2xl font-bold text-[#4E6766]">
          {requestId ? "Approve & Create Event" : "Create New Event"}
        </h2>
      </div>

      {/* Form Fields */}
      {["title", "location", "capacity", "description"].map((field) => (
        <div key={field}>
          <label className="block font-semibold capitalize text-gray-700">{field}</label>
          <input
            type={field === "capacity" ? "number" : "text"}
            name={field}
            value={form[field] ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder={`Enter ${field}`}
            required
          />
        </div>
      ))}

      <div>
        <label className="block font-semibold text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>

      {/* Educator Dropdown */}
      <div>
        <label className="block font-semibold text-gray-700">Assign Educator</label>
        <select
          value={selectedEducator}
          onChange={(e) => setSelectedEducator(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">Select Educator</option>
          {educators.map((edu) => (
            <option key={edu._id} value={edu._id}>
              {edu.name} ({edu.email})
            </option>
          ))}
        </select>
      </div>

      {/* Resources */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Assign Resources</label>
        {resources.length > 0 ? (
          resources.map((res) => (
            <div key={res._id} className="flex items-center gap-4 mb-2">
              <span className="w-1/3">{res.name}</span>
              <input
                type="number"
                min="0"
                placeholder="Quantity"
                value={selectedResources[res._id] || ""}
                onChange={(e) => handleResourceChange(res._id, e.target.value)}
                className="border px-2 py-1 rounded w-1/3"
              />
              <span className="text-sm text-gray-500">Available: {res.available}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No resources available.</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          {requestId ? "Create Event from Request" : "Create Event"}
        </button>
      </div>
    </div>
  );
};

export default CreateEventPage;
