import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">OpenSolar</div>
      <ul className="nav-links">
        <li><a href="#solutions">Solutions</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><button className="nav-button">Get Started</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;