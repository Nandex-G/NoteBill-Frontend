import React from 'react'

function Button({ value = 'Button', bgColor = 'bg-orange-400', hoverBgColor = 'hover:bg-orange-500', textColor = 'text-white', type = 'button', classNames = '', onClick, disabled = false }) {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={` duration-200 text-center select-none cursor-pointer  ${textColor} ${bgColor} ${hoverBgColor} ${classNames} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} `} > {value} </button>
  );
}

export default Button