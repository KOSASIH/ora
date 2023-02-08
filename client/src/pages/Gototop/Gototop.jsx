import React, { useState, useEffect } from "react";
import './gototop.scss'
const Gototop = () => {
  const [visible, setVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const handleShow = () => {
      let pageY = window.pageYOffset;
      if (pageY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleShow);
    return () => window.removeEventListener("scroll", handleShow);
  }, []);
  return (
    <div
      className={`top${visible ? "" : "hide-icon"} `}
      onClick={scrollToTop}
    >
      <i className='top__icon bx bx-chevron-up'></i>
    </div>
  );
};

export default Gototop;
