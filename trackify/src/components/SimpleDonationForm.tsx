"use client";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Heart } from 'lucide-react';
import Image from "next/image";

interface SimpleDonationFormProps {
  onBack: () => void;
}

export function SimpleDonationForm({ onBack }: SimpleDonationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    amount: ''
  });

  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowThankYou(true);

    // Reset form
    setFormData({ fullName: '', amount: '' });

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      setShowThankYou(false);
      onBack();
    }, 3000);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d3748] transition-opacity duration-500">
        <div className="bg-[#4a5568] text-center p-10 rounded-2xl shadow-lg max-w-md">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-[#ff8c00] animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-gray-200">
            Your generous donation means a lot to us.  
            We truly appreciate your support 💖
          </p>
          <p className="text-gray-400 text-sm mt-4">Redirecting you back to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d3748]">
      {/* Header */}
      <div className="flex p-6 mb-6">
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
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <Button
          onClick={onBack}
          className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Selection
        </Button>
      </div>

      {/* Donation Form */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-[#4a5568] rounded-lg p-8 border border-gray-600">
          {/* Service Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Support Our Cause</h2>
              <p className="text-gray-300 text-sm">Your donation helps sustain and expand our community programs</p>
            </div>
          </div>

          <div className="p-4 mb-5">
            <p className="text-gray-100 indent-4">
              Your generous donations help us sustain and expand our initiatives. Every contribution, big or small, 
              makes a meaningful impact by supporting our ongoing projects and community programs. 
              Together, we can make a difference.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name (Optional) */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
              />
            </div>

            {/* Amount (Required) */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Donation Amount <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter amount (₱)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
                className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-[#ff8c00] hover:bg-[#e67e00] text-white font-semibold py-3 rounded-md px-8"
              >
                Donate ₱{formData.amount || '0'}
              </Button>
              <Button 
                type="button" 
                onClick={onBack}
                className="bg-transparent hover:bg-[#5a6578] text-white border border-gray-600 rounded-md px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}