"use client";
import { Eye, EyeOff, Mail, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "../LandingPage/FooterSection/page";
import Navbar from "../LandingPage/Navbar/page";
import { useAppContext } from "@/app/useContext";
import CsutomerSignUpApi from "@/api/lib/Customer/Authntication/Signup/SignUp";
import { useRouter } from "next/navigation";
import CsutomerLoginApi from "@/api/lib/Customer/Authntication/login/login";
import VerifyOTP from "@/app/Component/UsefullComponent/OtpPage/page";
import ForgotPasswordComponent from "@/app/Component/UsefullComponent/ForgotPassword/page";
import OtpVerificationApi from "@/api/lib/Customer/Authntication/Otpverification/OtpVerification";
import OtpSendApi from "@/api/lib/Customer/Authntication/OtpSend/OtpSend";

export default function CustomerLogin() {
  const router = useRouter();
  const { categoryList, storeInfo } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [OtpCode, setOtpCode] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Address, setAddress] = useState("");
  const [responseBack, setResponseBack] = useState("");
  const [forgotPAssword, setForgotPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [OtpVerification, setOtpVerification] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Get navbar height dynamically
  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);
  const SignUpNow = async () => {
    try {
      setLoading(true);
      const formData = {
        userName: fullName,
        email: Email,
        password: Password,
        phoneNo: PhoneNo,
      };
      const response = await CsutomerSignUpApi(formData);
      if (response.status === 200 || response.status === 201) {
        setFullName("");
        setEmail("");
        setConfirmPassword("");
        setPassword("");
        setAddress("");
        setPhoneNo("");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };
  const OtpSendViaEmail = async (email: string) => {
    const response = await OtpSendApi(email);
    if (response.status === 200) {
      alert("Otp Send Successfully");
    }
  };
  const OtpVerificationReq = async (email: string) => {
    const formData = {
      code: OtpCode,
    };
    const response = await OtpVerificationApi(email, formData);
    if (response.status === 200) {
      alert("Otp Verified Successfully");
    }
  };
  const login = async () => {
    try {
      setLoading(true);
      const formData = {
        email: Email,
        password: Password,
      };
      const response = await CsutomerLoginApi(formData);
      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        setOtpVerification(true);
        await OtpSendViaEmail(Email);
        localStorage.setItem("CustomerToken", data?.token);
        setEmail("");
        setPassword("");
        alert("Login Successfully");
        //router.push("/Customer/MainPage/Dashbaord");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar
        scrolled={true}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={[]}
        onCommit={() => {}}
      />

      <div
        className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] px-4 py-10"
        style={{ paddingTop: `${navbarHeight + 50}px` }}
      >
        <h2
          className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Login /Sign-Up
        </h2>
        <hr className="w-1/2 border-gray-300 mt-6 mb-10" />
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl relative">
          {/* Left Section - Image */}
          <div className="relative hidden md:block md:w-1/2 h-64 md:h-auto">
            <Image
              src="/banner.jpg"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative z-10">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-md"></div>
                <span className="text-xl font-semibold">N.</span>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? "Start your journey" : "Join us today"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isLogin
                    ? "Sign in Now To Get Started"
                    : "Create your account"}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="example@email.com"
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <Mail
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No
                      </label>
                      <input
                        value={PhoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        type="text"
                        placeholder="1234567890"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        value={Address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="123 Street, City"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {isLogin && (
                  <div className="flex justify-end">
                    <p
                      onClick={() => setForgotPassword(true)}
                      className="text-blue-500   cursor-pointer hover:underline"
                    >
                      Forgot Password
                    </p>
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        value={ConfirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showPassword1 ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(!showPassword1)}
                        className="absolute right-3 top-2.5 text-gray-400"
                      >
                        {showPassword1 ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {ShowMessage && (
                  <>
                    {responseBack && (
                      <div
                        className={`w-full text-center px-4 py-3 mb-2 rounded ${
                          responseBack === "Record Added Successfully" ||
                          responseBack === "Login Successfully" ||
                          responseBack === "Request successful"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {responseBack}
                      </div>
                    )}
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={isLogin ? login : SignUpNow}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md py-2 mt-2 transition-colors"
                >
                  {isLogin ? (
                    <>{loading ? "Logging In..." : "Login"}</>
                  ) : (
                    <>{loading ? "Signing Up..." : "Sign Up"}</>
                  )}
                </button>
              </div>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 mt-6">
                {isLogin
                  ? "Don’t have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {OtpVerification && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setOtpVerification(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <VerifyOTP email={Email} code={setOtpCode} />
          </div>
        </div>
      )}
      {forgotPAssword && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setForgotPassword(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <ForgotPasswordComponent />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
