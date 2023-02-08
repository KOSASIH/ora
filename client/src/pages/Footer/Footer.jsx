import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./footer.scss";
const Footer = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  return location.pathname !== "/post/create/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/category" &&
    location.pathname !== "/search" &&
    location.pathname !== `/tao-tai-khoan` &&
    location.pathname !== `/messages` &&
    location.pathname !== `/post/update/${path}` ? (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__about">
          <div className="footer__about-logo">
            <img src="/icons/wideLogo.png" alt="" />
          </div>
          <div className="footer__about-menu">
            <ul className="footer__about-list">
              <li className="footer__about-item">
                <Link to="/">
                  <span className="footer__about-text">ABOUT PIORA</span>
                </Link>
              </li>
              <li className="footer__about-item">
                <Link to="/">
                  <span className="footer__about-text">CATERORY</span>
                </Link>
              </li>
              <li className="footer__about-item">
                <Link to="/">
                  <span className="footer__about-text">POLICY</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  ) : (
    ""
  );
};

export default Footer;
