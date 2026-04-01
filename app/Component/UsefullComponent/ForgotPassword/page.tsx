// pages/forgot-password.js or app/forgot-password/page.js
"use client";
import ChangePasswordApi from "@/api/lib/Customer/Authntication/ForgotPassword/ForgotPassword";
import OtpSendApi from "@/api/lib/Customer/Authntication/OtpSend/OtpSend";
import OtpVerificationApi from "@/api/lib/Customer/Authntication/Otpverification/OtpVerification";
import { useState } from "react";
interface returnpoprs {
  onclose: (data: boolean) => void;
}
export default function ForgotPasswordComponent({ onclose }: returnpoprs) {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtpAgain = async () => {
    try {
      setIsLoading(true);
      const response = await OtpSendApi(email);
      if (response.status === 200) {
        setStep(2);
        alert("Otp-Send Successfully");
      } else if (response.status === 400) {
        alert("No User Found with this Email");
      } else {
        alert("Failed To Send Otp. Please Try Again Later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const OtpVerification = async () => {
    try {
      setIsLoading(true);
      const formData = {
        code: otp,
      };
      const response = await OtpVerificationApi(email, formData);
      if (response.status === 200) {
        setStep(3);
        alert("Otp Verified Successfully");
      } else {
        alert("InValid Otp. Please Try Again Later");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const ChangePassword = async () => {
    try {
      setIsLoading(true);
      const response = await ChangePasswordApi(email, newPassword);
      if (response.status === 200) {
        onclose(false);
        alert("Password Changed Successfully");
      } else {
        alert("Something Went Wrong. Please Try Again Later");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-md  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 && "Enter your email to receive a 6-digit code"}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="mt-8 space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => sendOtpAgain()}
              disabled={!email}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Sending Otp..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="mt-8 space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => OtpVerification()}
              disabled={otp.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? " Verifying OTP..." : " Verify OTP"}
            </button>
            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Back to email
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="mt-8 space-y-6">
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => ChangePassword()}
              disabled={!newPassword || newPassword !== confirmPassword}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Reset Password
            </button>
          </div>
        )}

        {message && (
          <div className="text-center text-sm text-red-600">{message}</div>
        )}
      </div>
    </div>
  );
}
