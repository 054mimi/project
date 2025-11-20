import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button {...props} className={className + " px-3 py-1 rounded"}>
      {children}
    </button>
  );
};

export default Button;