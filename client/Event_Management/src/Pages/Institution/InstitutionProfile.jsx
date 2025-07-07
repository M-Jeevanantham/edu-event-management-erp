import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const InstitutionProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tech University",
    email: "contact@techuniv.edu",
    phone: "+91 98765 43210",
    address: "123 Innovation Lane, Chennai, India",
    description:
      "Tech University is a premier institution focused on delivering top-notch education and research in emerging technologies.",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // You can trigger a save/update API call here
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#4E6766]">Institution Profile</h1>
        {!isEditing && (
          <button
            className="flex items-center gap-2 text-[#4E6766] hover:underline"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Institution Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border rounded ${
              isEditing
                ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border rounded ${
              isEditing
                ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border rounded ${
              isEditing
                ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={2}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border rounded resize-none ${
              isEditing
                ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          ></textarea>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">About the Institution</label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={4}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border rounded resize-none ${
              isEditing
                ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          ></textarea>
        </div>

        {isEditing && (
          <div className="text-right">
            <button
              type="submit"
              className="bg-[#4E6766] text-white px-6 py-2 rounded hover:bg-[#3d5252] transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default InstitutionProfile;
