import { useAppContext } from "@/app/useContext";
import {
  Headphones,
  Instagram,
  Linkedin,
  Star,
  Truck,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { storeInfo } = useAppContext();
  const currentYear = new Date().getFullYear();

  const supportLinks = [
    { name: "FAQ", href: "/FrequenltyAskedQuestion" },
    { name: "Terms & Condition", href: "/Terms&Condition" },
  ];

  const socialIcons = [
    { icon: Twitter, href: storeInfo[0]?.twitter, label: "Twitter" },
    { icon: Instagram, href: storeInfo[0]?.instagram, label: "Instagram" },
    { icon: Facebook, href: storeInfo[0]?.facebook, label: "Facebook" },
    { icon: Youtube, href: storeInfo[0]?.youtube, label: "YouTube" },
    { icon: Linkedin, href: storeInfo[0]?.linkdin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-gray-900">
              {storeInfo[0]?.storeName}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover premium quality products designed to elevate your style
              and everyday life. Trusted by thousands of customers worldwide.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialIcons.map((social, index) => (
                <Link
                  key={index}
                  href={String(social.href)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Contact Info
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{storeInfo[0]?.email}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{storeInfo[0]?.phoneNo}</span>
                </li>
                {/* <li className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Lahore, Pakistan</span>
                </li> */}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Newsletter
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Subscribe for exclusive offers and updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                />
                <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Payment Methods */}
          <div className="flex items-center gap-3"></div>

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {currentYear} {storeInfo[0]?.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
