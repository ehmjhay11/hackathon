"use client";
import React from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/20">
      <div className="bg-white text-black rounded-2xl shadow-xl w-[90%] sm:w-[400px] p-6 relative animate-fadeIn">
        {/* ✖ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* 🧾 Title */}
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* 🧩 Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

