import {
  Headphones,
  Instagram,
  Linkedin,
  Star,
  Truck,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <footer className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-3">Karim5</h2>
              <p className="text-sm opacity-90 mb-6">
                Trusted by thousands of customers worldwide. Have questions?
                We’re here to help.
              </p>

              <div className="flex items-center gap-3">
                {[<Twitter />, <Instagram />, <Linkedin />, <Youtube />].map(
                  (item, index) => (
                    <span
                      key={index}
                      className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full text-sm cursor-pointer hover:bg-white/30 transition"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Get In Touch</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>support@yourbrand.com</li>
                <li>+92 300 1234567</li>
                <li>Lahore, Pakistan</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/products">Products</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to get the latest updates.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full px-4 py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-100 text-center py-4 text-sm text-gray-600">
          © {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
