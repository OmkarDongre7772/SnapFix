import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import ThoughtProcess from "../../assets/ThoughtProcess.svg";
import AuthHeader from "./AuthHeader";
import AuthToggle from "./AuthToggle";
import AuthForm from "./AuthForm";
import AuthSocials from "./AuthSocials";

const AuthenticationWindow = ({ showLoginModal, setShowLoginModal }) => {
  const { user, isLoggedIn, login, register } = useContext(UserContext);
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle login or register
  const handleAuth = async () => {
    setLoading(true);
    try {
      if (authMode === "login") {
        await login({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        alert(`✅ Logged in successfully as ${formData.role}!`);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        alert(`✅ Registered successfully as ${formData.role}!`);
      }

      // ✅ Navigate to role dashboard
      if (formData.role === "citizen") navigate("/citizen");
      else if (formData.role === "gigworker") navigate("/gigworker");
      else if (formData.role === "government") navigate("/government");

      setShowLoginModal(false);
    } catch (err) {
      console.error("Auth Error:", err.message);
      alert(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl relative animate-fadeInUp">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-4 text-white hover:text-indigo-400 transition text-xl font-bold"
            >
              ✕
            </button>

            {/* Illustration */}
            <img
              src={ThoughtProcess}
              alt="Auth Illustration"
              className="w-36 h-auto mx-auto mb-3 animate-fadeIn"
            />

            {/* Header, Toggle, Form, Socials */}
            <AuthHeader authMode={authMode} />
            <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
            <AuthForm
              authMode={authMode}
              formData={formData}
              handleChange={handleChange}
              handleAuth={handleAuth}
              loading={loading}
            />
            <AuthSocials />
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticationWindow;
