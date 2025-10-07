"use client";
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Heart } from 'lucide-react';
import Image from "next/image";

interface DonationFormProps {
  onBack: () => void;
}

export function DonationForm({ onBack }: DonationFormProps) {
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
      <div className="max-w-2xl mx-auto p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:text-[#ff8c00] hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center">
            <Image
              src="/img/logo.png"
              alt="Sorsogon Community Innovation Labs"
              width={32}
              height={32}
              className="w-8 h-8 mr-3"
            />
            <div className="text-left">
              <div className="text-white text-sm">SORSOGON COMMUNITY LABS</div>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-[#4a5568] rounded-lg p-8">
          <div className="p-4 mb-5">
            <h1 className="text-2xl font-bold mb-2 text-white">Support Our Cause</h1>
            <p className="text-gray-100 indent-4">
              Your generous donations help us sustain and expand our initiatives. Every contribution, big or small, 
              makes a meaningful impact by supporting our ongoing projects and community programs. 
              Together, we can make a difference.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name (Optional) */}
            <div>
              <label className="block text-gray-200 text-sm mb-2">
                Full Name (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white text-black border-0 rounded-md h-12"
              />
            </div>

            {/* Amount (Required) */}
            <div>
              <label className="block text-gray-200 text-sm mb-2">
                Donation Amount <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter amount (₱)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
                className="w-full bg-white text-black border-0 rounded-md h-12"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-8"
              >
                Donate
              </Button>
              <Button 
                type="button" 
                onClick={onBack}
                className="bg-[#4a5568] hover:bg-[#5a6578] text-white border border-gray-500 rounded-md px-8"
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
