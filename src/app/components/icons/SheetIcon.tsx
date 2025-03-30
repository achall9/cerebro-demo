import React from "react";

export const SheetIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h16v16H4z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 4v16"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 4v16"
    />
  </svg>
);

export default SheetIcon; 