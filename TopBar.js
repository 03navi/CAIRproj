import React, { useState } from 'react';
import './TopBar.css';
import avatar from '../assets/avatar.png';

function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top-bar">
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><button>Menu</button></li>
          <li><button>About Us</button></li>
          <li><button>Contact Us</button></li>
        </ul>
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
      </div>
      <div className="user-avatar">
        <img src={avatar} alt="Avatar" />
      </div>
    </div>
  );
}

export default TopBar;
