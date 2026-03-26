// pages/verify-otp.js or app/verify-otp/page.js (for App Router)
"use client";
import OtpSendApi from "@/api/lib/Customer/Authntication/OtpSend/OtpSend";
import { useEffect, useState } from "react";
interface verifyOptPorps {
  email: string;
  code: (code: string) => void;
}
export default function VerifyOTP({ email, code }: verifyOptPorps) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtpAgain = async () => {
    const response = await OtpSendApi(email);
    if (response.status === 200) {
      alert("Otp-Send Successfully");
    }
  };
  useEffect(() => {
    if (otp) {
      code(otp);
    }
  }, [otp]);
  return (
    <div className="max-w-md  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Identity
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to your phone/email
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              autoFocus
            />
          </div>

          {/* {message && (
            <div
              className={`text-center text-sm ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </div>
          )} */}

          <div>
            <button
              type="submit"
              disabled={otp.length !== 6 || isVerifying}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={sendOtpAgain}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
