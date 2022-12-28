import React, { useEffect, useMemo, useRef, useState } from "react";
import { throttle } from "lodash";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const updateScroll = () => {
    setIsScrolled(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  return (
    <div className={isScrolled ? "header_shadow" : "header"}>
      <a href="/" className="logo">
        Logo
      </a>
      <ul>
        <li>
          <a href="/" className="active">
            HOME
          </a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="/login">LOGIN</a>
        </li>
        <li>
          <a href="#">SIGN UP</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;
