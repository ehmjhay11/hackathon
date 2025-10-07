// components/ToolCard.tsx
interface ToolCardProps {
  icon: string;
  title: string;
}

export default function ToolCard({ icon, title}: ToolCardProps) {
  return (
    <div
      className="
        bg-white rounded-xl p-6 flex flex-col gap-3 items-center justify-center 
        shadow-md hover:shadow-xl transition-all duration-300 ease-in-out 
        transform hover:-translate-y-2 hover:scale-105 cursor-pointer
      "
    >
      <i className={`${icon} text-5xl sm:text-[200px] text-gray-800 transition-colors duration-300 hover:text-[#314A6F]`}></i>
      <h1 className="text-[#2E3033] uppercase font-bold">{title}</h1>
    </div>
  );
}
