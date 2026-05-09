import React from "react";
import "./styles.css";
import { IoSendOutline } from "react-icons/io5";

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-wrapper d-flex align-items-center justify-content-between">

          {/* LEFT */}
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              Stay home & get your daily needs
            </h2>

            <p className="newsletter-subtitle">
              Start your daily shopping with <span>Nest Mart</span>
            </p>

            <form className="newsletter-form">
              <div className="input-group-custom">
                <IoSendOutline className="mail-icon" />
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="form-control-custom"
                />
              </div>

              <button type="submit" className="btn-subscribe">
                Subscribe
              </button>
            </form>
          </div>

          {/* RIGHT */}
          <div className="newsletter-image d-none d-lg-block">
            <img
              src="https://ecommerce-fullstack-web-app.netlify.app/static/media/newsletter.5931358dd220a40019fc.png"
              alt="newsletter"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;