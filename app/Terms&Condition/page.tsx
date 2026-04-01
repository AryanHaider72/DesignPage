"use client";

import { useState } from "react";
import {
  Shield,
  Package,
  RefreshCw,
  Truck,
  CreditCard,
  Mail,
  XCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Navbar from "../Customer/LandingPage/Navbar/page";
import Footer from "../Customer/LandingPage/FooterSection/page";
import { useAppContext } from "../useContext";

export default function PolicyPage() {
  const { storeInfo, categoryList } = useAppContext();
  const [activeSection, setActiveSection] = useState("return");

  const sections = [
    { id: "return", title: "Return Eligibility", icon: Package },
    { id: "nonreturn", title: "Non-Returnable Items", icon: XCircle },
    { id: "refund", title: "Refund Process", icon: RefreshCw },
    { id: "exchange", title: "Exchange Policy", icon: CheckCircle },
    { id: "shipping", title: "Return Shipping", icon: Truck },
    { id: "cancellation", title: "Order Cancellation", icon: CreditCard },
    { id: "help", title: "Need Help?", icon: HelpCircle },
  ];

  return (
    <div className=" flex flex-col min-h-screen ">
      <Navbar
        scrolled={true}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={[]}
        onCommit={() => {}}
      />
      <div className="mt-25 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full px-4 py-2 mb-4">
                <Shield className="w-4 h-4 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-600">
                  Customer Protection
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Return & Refund Policy
              </h1>
              <p className="text-lg text-gray-600">
                We want you to love your purchase. Here's everything you need to
                know about returns, refunds, and exchanges.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Policy Sections
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Quick navigation</p>
                </div>
                <nav className="p-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          const element = document.getElementById(section.id);
                          element?.scrollIntoView({ behavior: "smooth" });
                          setActiveSection(section.id);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                          activeSection === section.id
                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            activeSection === section.id
                              ? "text-indigo-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Return Policy */}
              <div
                id="return"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Return Eligibility
                      </h2>
                      <p className="text-gray-600">
                        We offer a{" "}
                        <strong className="text-indigo-600">
                          7-day return policy
                        </strong>{" "}
                        to ensure you're completely satisfied with your
                        purchase.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium mb-1">
                          Return Requirements:
                        </p>
                        <ul className="text-green-700 text-sm space-y-1">
                          <li>
                            • Item must be unused and in original condition
                          </li>
                          <li>• Original packaging with all tags attached</li>
                          <li>• Return request within 7 days of delivery</li>
                          <li>• Proof of purchase required</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      Processing time: 2-3 business days after return received
                    </span>
                  </div>
                </div>
              </div>

              {/* Non-Returnable Items */}
              <div
                id="nonreturn"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Non-Returnable Items
                      </h2>
                      <p className="text-gray-600">
                        For health and safety reasons, certain items cannot be
                        returned.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Used or damaged items",
                      "Items without original packaging",
                      "Discounted or clearance products",
                      "Personal care & hygiene products",
                      "Customized or personalized items",
                      "Gift cards",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Refund Process */}
              <div
                id="refund"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <RefreshCw className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Refund Process
                      </h2>
                      <p className="text-gray-600">
                        Fast and hassle-free refunds to your original payment
                        method.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Return Inspection
                        </p>
                        <p className="text-sm text-gray-600">
                          We inspect returned items within 2-3 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Approval Notification
                        </p>
                        <p className="text-sm text-gray-600">
                          You'll receive email confirmation once approved
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-600 text-xs font-bold">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Refund Issued
                        </p>
                        <p className="text-sm text-gray-600">
                          Refund processed within 5-7 business days to original
                          payment method
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-900">Note:</strong> Shipping
                      charges are non-refundable. Refund timing depends on your
                      bank/card issuer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Exchange Policy */}
              <div
                id="exchange"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Exchange Policy
                      </h2>
                      <p className="text-gray-600">
                        Got a defective item? We'll make it right with a quick
                        exchange.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-purple-800">
                      Exchanges are available for{" "}
                      <strong>defective or damaged items</strong> only. Request
                      an exchange within 7 days of delivery and we'll ship the
                      replacement at no additional cost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Shipping */}
              <div
                id="shipping"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Truck className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Return Shipping
                      </h2>
                      <p className="text-gray-600">
                        Simple return shipping options for your convenience.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">
                        Damaged/Incorrect Items
                      </span>
                      <span className="text-green-600 font-medium">
                        Free Return Shipping
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Change of Mind</span>
                      <span className="text-gray-600">
                        Customer Responsible
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Cancellation */}
              <div
                id="cancellation"
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <CreditCard className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Order Cancellation
                      </h2>
                      <p className="text-gray-600">
                        Need to cancel your order? Here's how it works.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-yellow-800">
                      Orders can be canceled <strong>before shipment</strong>.
                      Once shipped, cancellation isn't possible, but you can
                      request a return after delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div
                id="help"
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm"
              >
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-full p-3 mb-4">
                    <Mail className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Need Help?
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Our support team is here to assist you with any questions
                    about returns or refunds.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Support
                    </button>
                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                      Live Chat
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    support@yourstore.com | Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Shield,
                text: "Secure Payments",
                desc: "256-bit encryption",
              },
              {
                icon: Clock,
                text: "Fast Processing",
                desc: "2-3 business days",
              },
              { icon: Truck, text: "Free Shipping", desc: "On orders $50+" },
              {
                icon: MessageCircle,
                text: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 text-center border border-gray-200"
                >
                  <Icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 text-sm">
                    {badge.text}
                  </p>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
