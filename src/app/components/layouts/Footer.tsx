import React from "react";
import {
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Bell,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#0A2C75] text-white py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Contact Info */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center mb-4">
              <Image
                src="/icons/footer-logo.svg"
                alt="Family Medicine Guide Logo"
                className="w-52 h-24"
                width={208}
                height={96}
              />
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-white">
                feel free to contact us on our contacts
              </p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white" />
                <p>996XXXXXXXXXXX</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white" />
                <p>info@familymedicineguide.com</p>
              </div>
              <p className="text-white mt-4">
                also Follow us on social media platforms:
              </p>

              <div className="flex space-x-4 mt-4">
                <Twitter className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                <Bell className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Sitemap */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-lg font-semibold mb-4 text-[#13E58A]">
              Sitemap
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  The Book
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  Protocols
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  Examination
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#136FB7] hover:text-white transition-colors"
                >
                  Lectures
                </a>
              </li>
            </ul>
          </div>

          {/* Email Signup and App Download */}
          <div className="col-span-1 md:col-span-6">
            <h4 className="text-lg font-semibold mb-4 text-[#13E58A]">
              Follow up our latest by e-mail
            </h4>

            <div className="bg-white rounded-full flex items-center overflow-hidden shadow-lg mb-8 max-w-md">
              <input
                type="email"
                placeholder="E-mail"
                className="flex-1 px-6 py-3 text-gray-700 focus:outline-none bg-transparent min-w-0"
              />
              <button
                className="px-8 py-3 m-1 font-semibold text-white transition-colors rounded-full"
                style={{ backgroundColor: "#136FB7" }}
              >
                Save
              </button>
            </div>

            <h4 className="text-lg font-semibold mb-4 text-white">
              Download DataElfM App Now!
            </h4>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.app.DalelApp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
              >
                <Image
                  src="/icons/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={180}
                  height={54}
                  className="h-12 w-auto"
                  sizes="(max-width: 640px) 160px, 180px"
                />
              </a>

              <a
                href="https://apps.apple.com/sa/app/daleel-fm/id6743419756"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 hover:-translate-y-1 transition-transform duration-200"
              >
                <Image
                  src="/icons/app-store-badge.png"
                  alt="Download on the App Store"
                  width={180}
                  height={54}
                  className="h-12 w-auto"
                  sizes="(max-width: 640px) 160px, 180px"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 mt-8 pt-6">
          <p className="text-end text-sm text-white">
            © All copyrights received Family Medicine Guide 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
