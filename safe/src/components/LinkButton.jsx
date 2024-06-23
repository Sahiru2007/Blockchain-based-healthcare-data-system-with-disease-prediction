import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useStateContext } from '../contexts/ContextProvider';

const LinkButton = ({ to, icon, bgColor, color, bgHoverColor, size, text, borderRadius, width }) => {
  const { setIsClicked, initialState } = useStateContext();

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        type="button"
        onClick={() => setIsClicked(initialState)}
        style={{ backgroundColor: bgColor, color: '#1f3749', borderRadius }}
        className={`text-${size} p-3 w-${width} transition duration-300 ease-in-out hover:drop-shadow-xl hover:bg-#1f3749 hover:text-orange-500`}
      >
        {icon} {text}
      </button>
    </Link>
  );
};

export default LinkButton;
