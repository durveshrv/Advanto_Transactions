import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center mt-4 mx-0" style={{ padding: '20px 0', margin: 0 }}>
      <div className="container-fluid p-0">
        <p className="mb-0">
          © {new Date().getFullYear()} Your Name. All Rights Reserved.
        </p>
        <p>
          <small>
            About Me: I am a passionate developer focused on creating engaging and user-friendly web applications.
          </small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
