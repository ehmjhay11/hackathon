import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";
import { useDonations } from '@/hooks/useApi';
import { DonationFormData } from '@/types';

interface DonationFormProps {
  onBack: () => void;
}

export function DonationForm({ onBack }: DonationFormProps) {
  const { createDonation } = useDonations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    donorName: '',
    type: 'monetary',
    amount: undefined,
    itemDescription: '',
    estimatedValue: undefined,
    condition: 'good'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data based on donation type
      if (formData.type === 'monetary' && (!formData.amount || formData.amount <= 0)) {
        throw new Error('Please enter a valid amount for monetary donation');
      }
      
      if (formData.type === 'item' && (!formData.itemDescription?.trim() || !formData.estimatedValue || formData.estimatedValue <= 0)) {
        throw new Error('Please provide item description and estimated value');
      }

      const submissionData: DonationFormData = {
        donorName: formData.donorName,
        type: formData.type,
        ...(formData.type === 'monetary' && { amount: formData.amount }),
        ...(formData.type === 'item' && {
          itemDescription: formData.itemDescription,
          estimatedValue: formData.estimatedValue,
          condition: formData.condition
        })
      };

      await createDonation(submissionData);
      
      alert('Donation submitted successfully!');
      setFormData({
        donorName: '',
        type: 'monetary',
        amount: undefined,
        itemDescription: '',
        estimatedValue: undefined,
        condition: 'good'
      });
      onBack(); // Return to dashboard after successful submission
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      donorName: '',
      type: 'monetary',
      amount: undefined,
      itemDescription: '',
      estimatedValue: undefined,
      condition: 'good'
    });
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | number | 'food' | 'toy' | 'clothes' | 'book' | 'other' | 'excellent' | 'good' | 'fair' | 'poor') => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                src="/img/logo.svg"
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
          <h2 className="text-white text-2xl font-bold mb-6 text-center">DONATION FORM</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  placeholder="Donor Name"
                  value={formData.donorName}
                  onChange={(e) => handleInputChange('donorName', e.target.value)}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'monetary' | 'item')}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12 px-3"
                >
                  <option value="monetary">Monetary Donation</option>
                  <option value="item">Item Donation</option>
                </select>
              </div>
              
              {formData.type === 'monetary' && (
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-white text-black border-0 rounded-md h-12"
                  />
                </div>
              )}
              
              {formData.type === 'item' && (
                <>
                  <div className="col-span-2">
                    <Input
                      type="text"
                      placeholder="Item Description"
                      value={formData.itemDescription || ''}
                      onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                      required
                      className="w-full bg-white text-black border-0 rounded-md h-12"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Estimated Value ($)"
                      value={formData.estimatedValue || ''}
                      onChange={(e) => handleInputChange('estimatedValue', parseFloat(e.target.value) || 0)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-white text-black border-0 rounded-md h-12"
                    />
                  </div>
                  <div>
                    <select
                      value={formData.condition || 'good'}
                      onChange={(e) => handleInputChange('condition', e.target.value as 'new' | 'excellent' | 'good' | 'fair')}
                      required
                      className="w-full bg-white text-black border-0 rounded-md h-12 px-3"
                    >
                      <option value="new">New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-[#2d3748] h-12"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white h-12 font-semibold"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}