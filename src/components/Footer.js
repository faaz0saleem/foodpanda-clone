import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1d1d1d] text-white pt-12 pb-6">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">foodpanda</h3>
            <p className="text-gray-400 mb-4">
              Order food and groceries online from restaurants and stores near you.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/delivery-areas" className="text-gray-400 hover:text-white">Delivery Areas</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Partner with us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Partner with us</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/add-restaurant" className="text-gray-400 hover:text-white">Add your Restaurant</Link>
              </li>
              <li>
                <Link to="/become-rider" className="text-gray-400 hover:text-white">Become a Rider</Link>
              </li>
              <li>
                <Link to="/corporate" className="text-gray-400 hover:text-white">Corporate Inquiries</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Download Apps Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Download our Apps</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <i className="fab fa-apple text-2xl"></i>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <i className="fab fa-google-play text-2xl"></i>
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex flex-wrap justify-center gap-4">
              <i className="fab fa-cc-visa text-3xl text-gray-400"></i>
              <i className="fab fa-cc-mastercard text-3xl text-gray-400"></i>
              <i className="fab fa-cc-amex text-3xl text-gray-400"></i>
              <i className="fas fa-money-bill-wave text-3xl text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>© {new Date().getFullYear()} foodpanda Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
