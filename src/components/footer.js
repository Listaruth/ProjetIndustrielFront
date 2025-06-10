import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">OpenSolar</div>
        <div className="footer-links">
          <a href="#solutions">Solutions</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-social">
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Facebook</a>
        </div>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} OpenSolar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;