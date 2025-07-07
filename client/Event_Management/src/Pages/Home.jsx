import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaUserPlus,
  FaCalendarAlt,
  FaCogs,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCommentDots,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  useEffect(() => {
    const animateCount = (ref, endValue) => {
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: endValue,
            duration: 2,
            ease: "power1.out",
            onUpdate: () => {
              ref.current.textContent = `${Math.floor(obj.val)}+`;
            },
          });
        },
      });
    };

    animateCount(ref1, 1500); // Institutions
    animateCount(ref2, 3000); // Educators
    animateCount(ref3, 14500); // Students
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-[#4E6766] text-white p-6 flex justify-between items-center sticky top-0 shadow z-50">
        <h1 className="text-2xl font-bold">EduEvent Manager</h1>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-[#4E6766] px-4 py-2 rounded hover:bg-[#f0edee]"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Home Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          id="home"
        ></div>

        {/* Overlay */}

        {/* Content */}
        <div className="relative z-10 text-center px-6 text-white max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">
            Welcome to EduEvent Manager
          </h2>
          <p className="text-lg mb-6">
            Your one-stop solution to plan, manage, and execute educational
            events seamlessly.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#4E6766] text-white px-6 py-3 rounded-lg hover:bg-[#3d5252] transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-white py-20 px-6 min-h-[100vh] flex items-center"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10">
          {/* Right - Image with Card below */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative group">
              <div className="overflow-hidden rounded-2xl shadow-xl transform transition duration-500 group-hover:scale-105 group-hover:rotate-1">
                <img
                  src="/Institutions.webp" // assuming it's in public folder
                  alt="Event Collaboration"
                  className="w-full h-72 object-cover"
                />
              </div>

              {/* Bottom Card */}
              <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-11/12 bg-white p-4 rounded-xl shadow-lg text-center">
                <p className="text-sm text-[#4E6766] font-medium">
                  Empowering institutions with streamlined event planning tools.
                </p>
              </div>
            </div>
          </div>

          {/* Left - Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl font-semibold mb-4 text-[#4E6766]">
              About EduEvent Manager
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              EduEvent Manager is your all-in-one educational event coordination
              platform. It empowers institutions to efficiently schedule,
              manage, and allocate resources for workshops, seminars, and
              academic conferences. By enabling seamless communication between
              students, educators, and organizers, our platform ensures smooth
              execution of educational activities while maintaining transparency
              and engagement.
            </p>
            <p className="mt-4 text-gray-700 text-md">
              With role-specific access, real-time updates, and resource
              tracking, EduEvent Manager bridges the gap between planning and
              participation—making event management easier, faster, and smarter.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white text-center">
        <h3 className="text-3xl font-bold mb-10 text-[#4E6766]">
          How It Works
        </h3>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaUserPlus className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">1. Register</h4>
            <p className="text-sm">
              Create an account as a student, educator, or institution.
            </p>
          </div>

          {/* Step 2 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaCalendarAlt className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">2. Create Events</h4>
            <p className="text-sm">
              Institutions can post and schedule educational events.
            </p>
          </div>

          {/* Step 3 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaCogs className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">3. Allocate Resources</h4>
            <p className="text-sm">
              Assign materials, equipment, and classrooms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaChalkboardTeacher className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">4. Educator Involvement</h4>
            <p className="text-sm">
              Educators guide sessions and manage agendas.
            </p>
          </div>

          {/* Step 5 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaUserGraduate className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">5. Student Participation</h4>
            <p className="text-sm">
              Students join events and access learning content.
            </p>
          </div>

          {/* Step 6 */}
          <div className="h-60 bg-[#4E6766] rounded-lg shadow transform transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center items-center text-white">
            <FaCommentDots className="text-3xl mb-2" />
            <h4 className="font-bold mb-1">6. Event Feedback</h4>
            <p className="text-sm">
              Feedback from users helps improve event quality.
            </p>
          </div>
        </div>
      </section>

      {/* Users */}
      <section id="users" className="bg-white py-20 px-4 text-center">
        <h3 className="text-3xl font-bold mb-10 text-[#4E6766]">Our Users</h3>

        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Institutions */}
          <div className="relative h-80 bg-white transform transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg overflow-hidden">
            <img
              src={"Institutions.webp"}
              alt="Institutions"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold text-[#4E6766]">
                Institutions
              </h4>
              <p ref={ref1} className="text-4xl font-bold text-[#4E6766] my-2">
                0+
              </p>
              <p className="text-gray-700">
                Organize and manage events across campuses.
              </p>
            </div>
          </div>

          {/* Educators */}
          <div className="relative h-80 bg-white transform transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg overflow-hidden">
            <img
              src={"Educators.jpg"}
              alt="Educators"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold text-[#4E6766]">
                Educators
              </h4>
              <p ref={ref2} className="text-4xl font-bold text-[#4E6766] my-2">
                0+
              </p>
              <p className="text-gray-700">
                Lead workshops and guide learners effectively.
              </p>
            </div>
          </div>

          {/* Students */}
          <div className="relative h-80 bg-white transform transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg overflow-hidden">
            <img
              src={"Students.jpg"}
              alt="Students"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold text-[#4E6766]">Students</h4>
              <p ref={ref3} className="text-4xl font-bold text-[#4E6766] my-2">
                0+
              </p>
              <p className="text-gray-700">
                Participate in learning and career-building events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact-section"
        className="bg-[#f0edee] h-[100vh] overflow-y-auto py-10 px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center mb-10">
          {/* Contact Info & Form */}
          <div>
            <h3 className="text-3xl font-semibold text-[#4E6766] mb-6">
              Get in Touch
            </h3>
            <p className="text-gray-700 mb-4">
              We'd love to hear from you! Whether you're an educator, student,
              or institution — reach out to us for support or collaboration.
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4E6766]"
              ></textarea>
              <button
                type="submit"
                className="bg-[#4E6766] text-white px-6 py-2 rounded hover:bg-[#3d5252] transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="EduEvent Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.27988892106!2d-74.25986508725365!3d40.69767006363062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b79f086b11%3A0x3054f9a1c2ec9fa3!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3 text-left">
          <div>
            <h4 className="text-lg font-semibold text-[#4E6766] mb-2">
              Contact Us
            </h4>
            <p>
              Email:{" "}
              <a href="mailto:support@eduevent.com" className="underline">
                support@eduevent.com
              </a>
            </p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: 123 Learning St, Chennai, India</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#4E6766] mb-2">
              Quick Links
            </h4>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:underline">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#4E6766] mb-2">
              Follow Us
            </h4>
            <p>Stay connected through our social platforms.</p>
            <div className="mt-2 space-x-3 text-xl text-[#4E6766]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                📘
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                🐦
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                🔗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-4 text-center">
          <p>© 2025 EduEvent Manager. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
