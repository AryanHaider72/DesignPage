import { Headphones, Star, Truck } from "lucide-react";

export default function ChooseUs() {
  const features = [
    {
      icon: <Headphones size={32} className="text-primary" />,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to assist you whenever you need help.",
    },
    {
      icon: <Truck size={32} className="text-primary" />,
      title: "Free Shipping",
      description:
        "Enjoy free and fast shipping on all orders with no hidden charges.",
    },
    {
      icon: <Star size={32} className="text-primary" />,
      title: "Premium Quality",
      description: "We provide top-quality products and highest standards.",
    },
  ];
  return (
    <section className="py-10 cursor-pointer">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Why Choose Us
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
