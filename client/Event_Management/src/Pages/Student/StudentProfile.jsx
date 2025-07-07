import React from "react";

const StudentProfile = () => {
  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Profile Info */}
        <div>
          <h2 className="text-xl font-semibold text-[#4E6766] mb-2">
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <strong>Name:</strong> Jeeva K
            </div>
            <div>
              <strong>Email:</strong> jeeva@example.com
            </div>
            <div>
              <strong>Phone:</strong> +91 98765 43210
            </div>
            <div>
              <strong>Institution:</strong> ABC University
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-[#4E6766] mb-2">
            Interests
          </h2>
          <p className="text-gray-700">
            Web Development, Machine Learning, Hackathons, Tech Events
          </p>
        </div>

        {/* Edit Button */}
        <div>
          <button className="bg-[#4E6766] text-white px-6 py-2 rounded hover:bg-[#3d5252] transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
