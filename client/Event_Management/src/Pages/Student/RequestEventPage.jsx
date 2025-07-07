import React, { useState, useEffect } from "react";
import axios from "axios";

const RequestEventPage = () => {
  const [title, setTitle] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [description, setDescription] = useState("");
  const [availableResources, setAvailableResources] = useState([]);
  const [requestedResources, setRequestedResources] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/student/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableResources(res.data);
      } catch (err) {
        console.error("Error fetching resources", err);
      }
    };

    fetchResources();
  }, []);

  const handleQuantityChange = (resourceId, count) => {
    setRequestedResources((prev) => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        count: Number(count),
      },
    }));
  };

  const handleResourceToggle = (resource) => {
    setRequestedResources((prev) => {
      const exists = prev[resource._id];
      if (exists) {
        const updated = { ...prev };
        delete updated[resource._id];
        return updated;
      } else {
        return {
          ...prev,
          [resource._id]: {
            name: resource.name,
            count: 1,
          },
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formattedResources = Object.entries(requestedResources).map(([resourceId, data]) => ({
      resourceId,
      count: data.count,
    }));

    try {
      await axios.post(
        "http://localhost:3001/api/student/request-event",
        {
          title,
          preferredDate,
          description,
          requestedResources: formattedResources,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Event and resource request submitted successfully.");
      setTitle("");
      setPreferredDate("");
      setDescription("");
      setRequestedResources({});
    } catch (err) {
      console.error(err);
      setMessage("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow-md border border-[#4E6766]">
      <h2 className="text-2xl font-semibold mb-4 text-[#4E6766]">Request a New Event with Resources</h2>

      {message && (
        <p className={`mb-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        {/* Resource selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Required Resources</label>
          <div className="space-y-3">
            {availableResources.map((res) => {
              const isSelected = !!requestedResources[res._id];
              return (
                <div
                  key={res._id}
                  className="flex items-center justify-between border p-3 rounded shadow-sm"
                >
                  <div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleResourceToggle(res)}
                      />
                      <span>{res.name}</span>
                    </label>
                    <p className="text-xs text-gray-500">Available: {res.available}</p>
                  </div>

                  {isSelected && (
                    <input
                      type="number"
                      min={1}
                      max={res.availableCount}
                      value={requestedResources[res._id]?.count }
                      onChange={(e) => handleQuantityChange(res._id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#4E6766] text-white px-4 py-2 rounded hover:bg-[#3a5150] transition-all"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestEventPage;
