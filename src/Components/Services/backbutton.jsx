import React from "react";
import { useNavigate } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";

function BackButton({ to }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBackClick}
      className="bg-white text-black p-2 rounded-full hover:bg-gray-200 flex items-center justify-center shadow-md"
    >
      <IoCaretBackOutline className="mr-2" size={20} />
    </button>
  );
}

export default BackButton;
