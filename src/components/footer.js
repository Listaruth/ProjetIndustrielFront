import React from 'react';
import '../style/footer.css'; // Link the styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">SunTrack</div>
        <nav className="footer-links">
          <a href="#solutions">Solutions</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="footer-social">
          <a href="https://x.com" aria-label="Twitter" target="_blank" rel="noreferrer" >Twitter</a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer" >LinkedIn</a>
          <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer" >Facebook</a>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} SunTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
