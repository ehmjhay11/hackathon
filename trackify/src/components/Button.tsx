"use client";

interface ButtonProps {
  buttonName: string;
  icon: string;
  onClick?: () => void; // 👈 Added this line
}

export default function Button({ buttonName, icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#D9D9D9] text-[#314A6F] py-3 px-5 rounded-md w-full sm:w-40 flex items-center justify-center gap-2 
                 hover:bg-[#FF9F43] hover:text-white transition duration-300 font-semibold text-sm sm:text-base 
                 transform hover:scale-105 shadow-md"
    >
      <i className={`${icon} text-lg sm:text-xl`}></i>
      <span>{buttonName}</span>
    </button>
  );
}
