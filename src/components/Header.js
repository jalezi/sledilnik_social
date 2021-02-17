import React, { useState } from 'react';

import './Header.css';
import Backdrop from './shared/Backdrop';
import SocialChanger from './SocialChanger';

function Header() {
  const [open, setOpen] = useState(false);

  const onHamburgerClick = event => {
    const header = document.getElementById('header');
    setOpen(prev => !prev);

    if (open) {
      header.classList.add('closingMenu');
      header.classList.remove('menuOpen');
    }

    if (!open) {
      header.classList.remove('closingMenu');
      header.classList.add('menuOpen');
    }
  };

  const onLinkClick = event => {
    const { target } = event;
    if (target.id === 'legend-link') {
      event.preventDefault();
      const legend = document.getElementById('legenda');
      legend.scrollIntoView({
        block: 'center',
      });
    }
    const header = document.getElementById('header');
    setOpen(false);
    header.classList.remove('menuOpen');
  };

  const onCloseHandler = event => {
    const header = document.getElementById('header');
    setOpen(false);
    header.classList.remove('menuOpen');
  };

  return (
    <header id="header" className="Header">
      <h1 className="logo">Covid-19 Sledilnik Social</h1>
      <SocialChanger />
      <div className="🍔" onClick={onHamburgerClick}>
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>
      <nav className="nav-container" onClick={onCloseHandler}>
        <div className="nav-heading">Meni</div>
        <a
          id="legend-link"
          className="nav-link"
          href="#legenda"
          onClick={onLinkClick}
        >
          Legenda
        </a>
        <a
          className="nav-link"
          href="https://covid-19.sledilnik.org/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
        >
          <div className="logo">Covid-19 Sledilnik</div>
        </a>
        <a
          className="nav-link"
          href="https://covid-spark.info/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
        >
          <div className="logo">Spark</div>
        </a>
        <a
          className="nav-link"
          href="https://sledilnik-social-ver-0-1-0.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
        >
          ver 0.1.0
        </a>
      </nav>
      <Backdrop
        className="backdrop-sidebar"
        onClick={onCloseHandler}
      ></Backdrop>
    </header>
  );
}

export default Header;
