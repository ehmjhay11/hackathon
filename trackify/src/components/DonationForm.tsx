import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";

interface DonationFormProps {
  onBack: () => void;
}

export function DonationForm({ onBack }: DonationFormProps) {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted successfully!');
    setFormData({
      field1: '',
      field2: '',
      field3: '',
      field4: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      field1: '',
      field2: '',
      field3: '',
      field4: ''
    });
  };

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

        {/* Form */}
        <div className="bg-[#4a5568] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  placeholder="Enter field 1"
                  value={formData.field1}
                  onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Enter field 2"
                  value={formData.field2}
                  onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Enter field 3"
                  value={formData.field3}
                  onChange={(e) => setFormData({ ...formData, field3: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Enter field 4"
                  value={formData.field4}
                  onChange={(e) => setFormData({ ...formData, field4: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-8"
              >
                Submit
              </Button>
              <Button 
                type="button" 
                onClick={handleCancel}
                className="bg-[#4a5568] hover:bg-[#5a6578] text-white border border-gray-500 rounded-md px-8"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                className="bg-[#4a5568] hover:bg-[#5a6578] text-white border border-gray-500 rounded-md px-8"
              >
                Add Purchase
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}