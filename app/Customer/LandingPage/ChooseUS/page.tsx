import { Headphones, Truck, Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChooseUs() {
  const features = [
    {
      icon: <Headphones size={32} strokeWidth={1.5} />,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to assist you whenever you need help.",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      delay: 0,
    },
    {
      icon: <Truck size={32} strokeWidth={1.5} />,
      title: "Free Shipping",
      description:
        "Enjoy free and fast shipping on all orders with no hidden charges worldwide.",
      bgGradient: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
      delay: 0.1,
    },
    {
      icon: <Star size={32} strokeWidth={1.5} />,
      title: "Premium Quality",
      description:
        "We provide top-quality products and maintain the highest industry standards.",
      bgGradient: "from-amber-50 to-orange-50",
      iconColor: "text-amber-600",
      delay: 0.2,
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gray-300" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Why Choose Us
              </span>
              <div className="h-px w-8 bg-gray-300" />
            </div>
          </div>
          <h2
            className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Makes Us Different
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Experience the difference with our premium services and unwavering
            commitment to excellence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${feature.delay}s` }}
            >
              <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="p-6 md:p-8">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.bgGradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                    >
                      <div className={feature.iconColor}>{feature.icon}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-center text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className={`mt-16 pt-12 border-t border-gray-200 transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Happy Customers", value: "50K+", icon: "😊" },
              { label: "Products Delivered", value: "100K+", icon: "📦" },
              { label: "Countries Served", value: "25+", icon: "🌍" },
              { label: "Years Experience", value: "10+", icon: "⭐" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
