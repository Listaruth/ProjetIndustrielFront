import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to={"/"} className='logo-link'> <div className="logo">OpenSolar</div></Link>
      <ul className="nav-links">
        <li><a href="#solutions">Solutions</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li>
          <Link to={"/solarview"} className="nav-link"> 
            <button className="nav-button">Solar Installation</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;