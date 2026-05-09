import React from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

import "./styles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        {/* TOP */}
        <div className="footer-top">

          {/* LOGO + ABOUT */}
          <div className="footer-col">
            <h2 className="logo">NestMart</h2>
            <p className="footer-text">
              Awesome grocery store website template. Clean, modern and easy to use.
            </p>

            <ul className="contact-info">
              <li><FiMapPin /> 5171 W Campbell Ave undefined Kent, Utah 53127</li>
              <li><FiPhone /> (+91) - 540-025-124553</li>
              <li><FiMail /> sale@NestMart.com</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Delivery Info</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li>Sign In</li>
              <li>View Cart</li>
              <li>My Wishlist</li>
              <li>Track My Order</li>
              <li>Help Ticket</li>
            </ul>
          </div>

          {/* APP */}
          <div className="footer-col">
            <h4>Install App</h4>
            <p className="footer-text">From App Store or Google Play</p>

            <div className="app-buttons">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" />
            </div>

            <p className="footer-text mt-2">Secured Payment Gateways</p>
            <img
              className="payment-img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png"
            />
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>© 2026, NestMart - All rights reserved</p>

          <div className="socials">
            <FiFacebook />
            <FiTwitter />
            <FiInstagram />
            <FiYoutube />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;