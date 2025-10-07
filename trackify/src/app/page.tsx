import Image from "next/image";
import logo from "../img/logo.png";

function ToolCard({ icon }: { icon: string }) {
  return (
    <div
      className="
        bg-white rounded-xl p-6 flex items-center justify-center 
        shadow-md hover:shadow-xl transition-all duration-300 ease-in-out
        transform hover:-translate-y-2 hover:scale-105 cursor-pointer
      "
    >
      <i className={`${icon} text-5xl sm:text-[200px] text-gray-800 transition-colors duration-300 hover:text-[#314A6F]`}></i>
    </div>
  );
}


function Button({ buttonName, icon }: { buttonName: string; icon: string }) {
  return (
    <button
      className="
        bg-[#D9D9D9] text-[#314A6F] 
        py-3 px-5 rounded-md w-full sm:w-40 
        flex items-center justify-center gap-2 
        font-semibold text-sm sm:text-base
        transition-all duration-300 ease-in-out
        hover:bg-[#314A6F] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95
      "
    >
      <i className={`${icon} text-lg sm:text-xl`}></i>
      <span>{buttonName}</span>
    </button>
  );
}

export default function Home() {
  return (
    <div className="bg-[#2E3033] text-white min-h-screen p-5 sm:p-7 flex flex-col gap-16">

      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center mb-6 gap-3 sm:gap-3">
        <div className="rounded-full p-2 sm:p-4 flex-shrink-0">
          <Image
            src={logo}
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
          <ToolCard icon="fa-solid fa-print" />
          <ToolCard icon="fa-solid fa-screwdriver-wrench" />
          <ToolCard icon="fa-solid fa-gear" />
        </div>
      </div>

      {/* ✅ Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
        <Button buttonName="Payment" icon="fa-solid fa-money-bill-1" />
        <Button buttonName="Donation" icon="fa-solid fa-money-check" />
        <Button buttonName="Report" icon="fa-solid fa-file" />
      </div>
    </div>
  );
}
