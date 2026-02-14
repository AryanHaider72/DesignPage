"use client";
import AdminLoginApi from "@/api/lib/Admin/Authentication/login/login";
import { ResponseLoginData } from "@/api/types/Admin/Authentication/Login/login";
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      const formData = { Email: email, password: password };
      const response = await AdminLoginApi(formData);
      console.log(response);

      if (response.status !== 200) {
        setShowMessage(response.message);
      }
      const data = response.data as ResponseLoginData;
      if (data?.isValid) {
        // save token first
        localStorage.setItem("adminToken", data.token);
        setLoading(false);
        // absolute path
        window.location.href = "/admin/AdminPortal/MainPage/Dashboard";
      } else {
        setShowMessage(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage("");
    }, 3000);
  }, [showMessage]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 ">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h3 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h3>
          <p className="text-lg text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Section */}
        <div
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* Email Field */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail />{" "}
                {/* Simple email icon; replace with an SVG if preferred */}
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-md font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your password"
                required
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock />{" "}
                {/* Simple lock icon; replace with an SVG if preferred */}
              </span>
            </div>
          </div>
          <p className="text-red-500 text-md">{showMessage}</p>
          {/* Login Button */}
          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
          >
            Forgot your password?
          </a>
          <p className="text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
