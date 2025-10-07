import { Button } from './ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import Image from "next/image";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-[#2d3748]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 mb-6">
        <div className="flex items-center">
          <Image
              src="/img/logo.svg"
              alt="Sorsogon Community Innovation Labs"
              width={32}
              height={32}
              className="w-16 h-16 mr-3"
          />
          <div className="text-left">
            <div className="text-white text-2xl font-bold">SORSOGON COMMUNITY</div>
            <div className="text-[#ff8c00] text-2xl font-bold">INNOVATION LABS</div>
          </div>
        </div>
        
        {/* Back Button */}
        <Button
          onClick={onBack}
          className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Admin Content */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Administrative interface for managing the Innovation Labs system.
          </p>
          
          <div className="bg-[#4a5568] rounded-lg p-8 border border-gray-600 max-w-md mx-auto">
            <p className="text-gray-400 text-sm">
              This page is currently under development. Admin features will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}