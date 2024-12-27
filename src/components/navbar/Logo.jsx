import React from "react";
import { useNavigate } from 'react-router-dom'

function Logo() {
  const navigate = useNavigate();
  
  return (
    <img
      onClick={() => navigate("/")}
      alt="logo"
      className="hidden md:block cursor-pointer"
      height={100}
      width={100}
      src="/logo.png"
    />
  );
}

export default Logo;
