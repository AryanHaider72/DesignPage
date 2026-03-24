"use client";
import { useState, useRef, useEffect } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  avatar?: string;
  verified: boolean;
}

export default function CustomerReviews() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const reviews: Review[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      date: "March 15, 2026",
      review:
        "Absolutely stunning quality! The product exceeded my expectations. The attention to detail and craftsmanship is outstanding. Will definitely be shopping here again!",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Toronto, Canada",
      rating: 5,
      date: "March 12, 2026",
      review:
        "Fast shipping and excellent customer service. The items arrived beautifully packaged and in perfect condition. Highly recommend this store!",
      verified: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Los Angeles, USA",
      rating: 4,
      date: "March 10, 2026",
      review:
        "Great products and amazing quality. The customer support team was very helpful when I had questions. Will definitely be a returning customer.",
      verified: true,
    },
    {
      id: 4,
      name: "David Williams",
      location: "London, UK",
      rating: 5,
      date: "March 8, 2026",
      review:
        "Hands down the best online shopping experience I've had. The product quality is premium and the delivery was faster than expected.",
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      location: "Sydney, Australia",
      rating: 5,
      date: "March 5, 2026",
      review:
        "I'm obsessed with my new purchase! The quality is incredible and the design is exactly what I was looking for.",
      verified: true,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      updateActiveIndex(-1);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      updateActiveIndex(1);
    }
  };

  const updateActiveIndex = (direction: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 400;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / (cardWidth + 24));
      setActiveIndex(newIndex);
    }
  };

  const scrollToReview = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 400;
      const gap = 24;
      const scrollAmount = index * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
        />
      ));
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-gray-300" />
              <span className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Testimonials
              </span>
              <div className="h-px w-12 bg-gray-300" />
            </div>
          </div>
          <h2
            className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Customer Reviews
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            What our customers say about their experience with us
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {reviews.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 sm:-translate-x-4
                         rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                         transition-all duration-200 border border-gray-200"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 sm:translate-x-4
                         rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                         transition-all duration-200 border border-gray-200"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="overflow-x-auto pb-8 scrollbar-hide"
            onScroll={() => updateActiveIndex(0)}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              className="flex gap-6 scroll-smooth"
              style={{ width: "max-content", minWidth: "100%" }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] flex-shrink-0
                           transform transition-all duration-500 ${
                             isVisible
                               ? "translate-y-0 opacity-100"
                               : "translate-y-20 opacity-0"
                           }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Quote Icon */}
                    <div className="px-6 pt-6">
                      <Quote className="w-8 h-8 text-gray-300" />
                    </div>

                    <div className="p-6">
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-4">
                        {renderStars(review.rating)}
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-600 leading-relaxed mb-6 min-h-[100px] text-sm">
                        "{review.review}"
                      </p>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {review.name}
                            </h4>
                            {review.verified && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {review.location}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
