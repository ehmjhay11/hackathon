"use client";
import { useState } from "react";
import Logo from "next/image";
import Button from "@/components/Button";
import ToolCard from "@/components/ToolCard";
import Modal from "@/components/Modal";

export default function Home() {

  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div className="bg-[#2E3033] text-white min-h-screen p-5 sm:p-7 flex flex-col gap-16">

      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center mb-6 gap-3 sm:gap-6">
        <div className="rounded-full p-2 sm:p-4 flex-shrink-0">
          <Logo
            src="/img/logo.png"
            alt="Sorsogon Community Innovation Labs Logo"
            width={70}
            height={70}
            priority
          />
        </div>
        <div className="text-center sm:text-left leading-tight">
          <h2 className="text-xl sm:text-3xl tracking-wider">
            SORSOGON COMMUNITY
          </h2>
          <h1 className="text-2xl sm:text-4xl font-bold text-orange-600">
            INNOVATION LABS
          </h1>
        </div>
      </div>


      {/* ✅ Tools / Services Section */}
      <div className="flex flex-col justify-center items-center text-center gap-6">
        <h1 className="font-bold text-xl sm:text-2xl tracking-wider uppercase">
          Tools / Services
        </h1>

        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6 justify-center">
          <ToolCard icon="fa-solid fa-print" title="3D Printer"/>
          <ToolCard icon="fa-solid fa-screwdriver-wrench" title="Tools"/>
          <ToolCard icon="fa-solid fa-gear" title="Components"/>
        </div>
      </div>

      {/* ✅ Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
        <Button
          buttonName="Payment"
          icon="fa-solid fa-money-bill-1"
          onClick={() => setOpenModal("Payment")}
        />
        <Button
          buttonName="Donation"
          icon="fa-solid fa-money-check"
          onClick={() => setOpenModal("Donation")}
        />
        <Button
          buttonName="Report"
          icon="fa-solid fa-file"
          onClick={() => setOpenModal("Report")}
        />
      </div>

      {/* ✅ Modal */}
      <Modal
        isOpen={!!openModal}
        onClose={() => setOpenModal(null)}
        title={openModal || ""}>

        {/* 🎯 Dynamic modal content */}
        {openModal === "Payment" && (
          <div>
            <p>💳 Handle your payment process here.</p>
            <input
              type="text"
              placeholder="Enter amount"
              className="border p-2 rounded w-full mt-2"
            />
          </div>
        )}

        {openModal === "Donation" && (
          <div>
            <p>🎁 Thank you for donating! Please fill in the details below.</p>
            <input
              type="text"
              placeholder="Your name"
              className="border p-2 rounded w-full mt-2"
            />
          </div>
        )}

        {openModal === "Report" && (
          <div>
            <p>📝 Submit your report here.</p>
            <textarea
              placeholder="Describe your report..."
              className="border p-2 rounded w-full mt-2"
            />
          </div>
        )}
      </Modal>

    </div>
  );
}
