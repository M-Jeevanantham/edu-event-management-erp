import React from "react";

const EducatorProfile = () => {
  const educator = {
    name: "Dr. Aarthi Menon",
    email: "aarthi.menon@university.edu",
    specialization: "Computer Science & AI",
    institution: "National Institute of Technology",
    experience: "8 years",
    contact: "+91 98765 12345",
  };

  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">My Profile</h1>

      <div className="bg-white shadow p-6 rounded-lg max-w-xl space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Full Name</h3>
          <p>{educator.name}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Email</h3>
          <p>{educator.email}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Institution</h3>
          <p>{educator.institution}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Specialization</h3>
          <p>{educator.specialization}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Experience</h3>
          <p>{educator.experience}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#4E6766]">Contact</h3>
          <p>{educator.contact}</p>
        </div>

        <div className="pt-4">
          <button className="bg-[#4E6766] text-white px-6 py-2 rounded hover:bg-[#3d5252] transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;
