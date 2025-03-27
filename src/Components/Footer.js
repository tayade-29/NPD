import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: "linear-gradient(to right top, #008ed6, #00b3dd, #88ecb4, #e3ffa7)",
        backgroundColor: "unset",
      }}
      className="text-black py-1"
    >
     

      {/* Bottom Section */}
      <div className="mt-8 text-center text-sm text-black py-3">
        <p>© 2025 Rytnow Systems Pvt. Ltd. All rights reserved.</p>


      </div>
    </footer>
  );
};

export default Footer;
