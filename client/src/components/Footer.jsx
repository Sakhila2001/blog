import React from "react";
import { assets } from "../assets/assets";
import { footer_data } from "../assets/assets"; // adjust the path if needed

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        {/* Logo + description */}
        <div>
          <img src={assets.logo} alt="logo" className="w-32 sm:w-44" />
          <p className="max-w-[410px] mt-6">
            Sakhila’s Blog shares insights on technology, startups, and ideas
            that inspire learning and growth.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>

              {/* Special case for "Follow Us" to show icons */}
              {section.title === "Follow Us" ? (
                <div className="flex space-x-6 mb-6 md:mb-0">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/sakhila.thami.3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-teal-900 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.676 0H1.326C.594 0 0 .594 0 1.326v21.348C0 23.406.594 24 1.326 24h11.483v-9.294H9.691v-3.622h3.118V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.917c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.676 0" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sakhila_thami?igsh=MW04OHNydGh3ZzY3MA%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-teal-900 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.07 4.849-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.633.074-3.355.432-4.671 1.749-1.316 1.316-1.674 3.038-1.749 4.671-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.633.432 3.355 1.749 4.671 1.316 1.316 3.038 1.674 4.671 1.749 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.633-.074 3.355-.432 4.671-1.749 1.316-1.316 1.674-3.038 1.749-4.671.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.633-.432-3.355-1.749-4.671-1.316-1.316-3.038-1.674-4.671-1.749-1.28-.058-1.688-.072-4.947-.072z" />
                      <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                      <circle cx="18.406" cy="5.594" r="1.44" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/sakhila-thami-a47649260/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-teal-900 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.125 20.452H3.577V9h3.548v11.452zM5.351 7.647a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM20.452 20.452h-3.548v-5.604c0-1.336-.027-3.054-1.862-3.054-1.862 0-2.146 1.454-2.146 2.956v5.702h-3.548V9h3.41v1.561h.048c.476-.9 1.64-1.85 3.374-1.85 3.61 0 4.276 2.377 4.276 5.467v6.274z" />
                    </svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/Sakhila2001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-teal-900 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.932 0-1.31.468-2.381 1.235-3.221-.123-.302-.535-1.521.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 6.003 0c2.293-1.552 3.299-1.23 3.299-1.23.653 1.655.241 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.805 5.63-5.475 5.922.43.371.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.289 0 .321.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
              ) : (
                <ul className="text-sm space-y-1">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:underline transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-sm text-zinc-800 text-center py-4">
        <a
          href="https://sakhilathami.com.np"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; {new Date().getFullYear()} Sakhila Thami. All rights reserved.
        </a>
      </div>
    </div>
  );
};

export default Footer;
