"use client";
import { Send, Star, UserCircle } from "lucide-react";
import { useState } from "react";

export default function ReviewAndMessage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Ali Khan",
      message: "Excellent quality and fast delivery! Totally worth the price.",
      rating: 5,
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
    {
      id: 3,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      message: "Good product but packaging could be improved.",
      rating: 4,
      date: "5 days ago",
    },
  ]);
  const handleRating = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };
  const [newReview, setNewReview] = useState({
    name: "",
    message: "",
    rating: 0,
  });
  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-16 mb-16 px-4">
        <h2 className="text-2xl font-bold flex justify-start text-gray-900 mb-8 text-center">
          Customer Reviews & Ratings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* === LEFT: Review Form (Fixed) === */}
          <div className="relative">
            <div className="sticky top-24">
              <form
                // onSubmit={handleSubmit}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Write a Review
                </h3>

                {/* Name Field */}
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                />

                {/* Message Field */}
                <textarea
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={newReview.message}
                  onChange={(e) =>
                    setNewReview({ ...newReview, message: e.target.value })
                  }
                ></textarea>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-gray-700 font-medium mr-2">
                    Your Rating:
                  </span>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      onClick={() => handleRating(i + 1)}
                      className={`w-6 h-6 cursor-pointer transition ${
                        i < newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
                >
                  <Send className="w-4 h-4" /> Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* === RIGHT: Scrollable Reviews === */}
          <div className="w-full max-h-[600px] overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
