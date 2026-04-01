"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  RefreshCw,
  Globe,
  MessageCircle,
} from "lucide-react";
import Footer from "../Customer/LandingPage/FooterSection/page";
import Navbar from "../Customer/LandingPage/Navbar/page";
import { useAppContext } from "../useContext";

type FAQItem = {
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
};

const faqData: FAQItem[] = [
  {
    question: "How can I place an order?",
    answer:
      "Browse products, add them to your cart, and proceed to checkout. Follow the simple steps to complete your purchase. You'll receive an order confirmation email once your order is successfully placed.",
    category: "Orders",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, MasterCard, American Express), bank transfers, mobile wallets (JazzCash, EasyPaisa), and cash on delivery (COD). All transactions are secure and encrypted.",
    category: "Payments",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 2-5 business days depending on your location. Major cities typically receive deliveries within 2-3 days, while remote areas may take 4-5 days. You'll receive tracking information once your order ships.",
    category: "Shipping",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes, you can return or exchange within 7 days of delivery if the product is unused, unwashed, and in original packaging with all tags attached. Simply contact our customer support to initiate the process.",
    category: "Returns",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing an order, you will receive a tracking ID via email and SMS. You can also track your order in real-time by logging into your account and visiting the 'My Orders' section.",
    category: "Orders",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only deliver within Pakistan. However, we're working on expanding our shipping network to serve international customers in the near future. Stay tuned for updates!",
    category: "Shipping",
  },
  {
    question: "What if I receive a defective product?",
    answer:
      "If you receive a defective or damaged product, please contact us within 48 hours of delivery with photos of the product and packaging. We'll arrange a free replacement or full refund immediately.",
    category: "Returns",
  },
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes! Join our loyalty program to earn points on every purchase. Accumulated points can be redeemed for discounts on future orders. Sign up for free on our website or mobile app.",
    category: "Account",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Orders: <Package className="w-5 h-5" />,
  Payments: <CreditCard className="w-5 h-5" />,
  Shipping: <Truck className="w-5 h-5" />,
  Returns: <RefreshCw className="w-5 h-5" />,
  Account: <HelpCircle className="w-5 h-5" />,
};

const categories = ["All", ...new Set(faqData.map((item) => item.category))];

export default function FAQPage() {
  const { storeInfo, categoryList } = useAppContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className=" flex flex-col min-h-screen ">
      <Navbar
        scrolled={true}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={[]}
        onCommit={() => {}}
      />
      <div className=" mt-35 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category !== "All" && categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filteredFAQs.length > 0 && (
            <div className="mb-6 text-sm text-gray-500 text-center">
              Found {filteredFAQs.length} question
              {filteredFAQs.length !== 1 ? "s" : ""}
            </div>
          )}

          {/* FAQ Accordion */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1 text-indigo-500">
                        {categoryIcons[item.category]}
                      </div>
                      <span className="font-semibold text-gray-900 text-lg flex-1 pr-4">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        activeIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-100 bg-gray-50/30">
                      <div className="flex gap-3">
                        <div className="w-5"></div>
                        <div className="flex-1 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results State
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                We couldn't find any questions matching "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Still Need Help Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-10 text-center">
            <MessageCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our support team is here to
              help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                Live Chat
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Average response time: &lt; 2 hours
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-gray-500">Support Available</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-sm text-gray-500">Secure Payments</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">7 Days</div>
              <div className="text-sm text-gray-500">Easy Returns</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">Free</div>
              <div className="text-sm text-gray-500">Order Tracking</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
