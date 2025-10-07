import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Calculator, Zap } from 'lucide-react';
import Image from "next/image";
import { SolderingPaymentData, ServiceRates } from '@/types';

// Service rates - constants outside component to avoid useEffect dependencies
const SERVICE_RATES: ServiceRates = {
  power: 5, // ₱5/hour for 3D printer
  soldering: 10, // ₱10/hour for soldering station
  spoolWeight: 1000 // 1000g per spool
};

interface SolderingPaymentFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function SolderingPaymentForm({ onBack, onComplete }: SolderingPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    hoursUsed: '',
    paymentMethod: '' as 'cash' | 'card' | 'bank_transfer' | ''
  });

  const [calculations, setCalculations] = useState<SolderingPaymentData>({
    hoursUsed: 0,
    totalCost: 0
  });

  // Calculate costs whenever form data changes
  useEffect(() => {
    const hours = parseFloat(formData.hoursUsed) || 0;
    const totalCost = hours * SERVICE_RATES.soldering;

    setCalculations({
      hoursUsed: hours,
      totalCost: totalCost
    });
  }, [formData.hoursUsed]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.hoursUsed || parseFloat(formData.hoursUsed) <= 0) {
        throw new Error('Please enter a valid number of hours');
      }
      if (!formData.paymentMethod) {
        throw new Error('Please select a payment method');
      }

      // Submit payment
      const paymentData = {
        userId: 'current-user', // This should come from auth context
        serviceName: 'soldering-station',
        description: `Soldering Station: ${calculations.hoursUsed} hours`,
        amount: calculations.totalCost,
        paymentMethod: formData.paymentMethod,
        serviceDetails: calculations
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment submission failed');
      }

      // Success
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Payment Form */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-[#4a5568] rounded-lg p-8 border border-gray-600">
          {/* Service Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Soldering Station Payment</h2>
              <p className="text-gray-300 text-sm">Hourly rate for soldering station usage</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hours Used */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Hours Used
              </label>
              <Input
                type="number"
                value={formData.hoursUsed}
                onChange={(e) => handleInputChange('hoursUsed', e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
                placeholder="Enter hours used"
                min="0.1"
                step="0.1"
                required
                disabled={isSubmitting}
              />
              <p className="text-gray-400 text-xs mt-1">
                Rate: ₱{SERVICE_RATES.soldering}/hour
              </p>
            </div>

            {/* Cost Breakdown */}
            <Card className="bg-[#2d3748] border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-[#ff8c00]" />
                  <h3 className="text-white font-semibold">Cost Calculation</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Hours Used:</span>
                    <span>{calculations.hoursUsed} hours</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Hourly Rate:</span>
                    <span>₱{SERVICE_RATES.soldering}/hour</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-[#ff8c00]">₱{calculations.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {calculations.hoursUsed > 0 && (
                  <div className="mt-4 p-3 bg-[#4a5568] rounded-md">
                    <p className="text-gray-300 text-xs">
                      Calculation: {calculations.hoursUsed} hours × ₱{SERVICE_RATES.soldering}/hour = ₱{calculations.totalCost.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Payment Method
              </label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3748] border-gray-600">
                  <SelectItem value="cash" className="text-white focus:bg-[#4a5568]">Cash</SelectItem>
                  <SelectItem value="card" className="text-white focus:bg-[#4a5568]">Card</SelectItem>
                  <SelectItem value="bank_transfer" className="text-white focus:bg-[#4a5568]">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || calculations.totalCost <= 0}
              className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white font-semibold py-3 rounded-md transition-colors"
            >
              {isSubmitting ? 'Processing Payment...' : `Pay ₱${calculations.totalCost.toFixed(2)}`}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-[#2d3748] rounded-md border border-gray-600">
            <h4 className="text-white text-sm font-semibold mb-2">Soldering Station Information</h4>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>• Professional soldering equipment available</li>
              <li>• Includes soldering iron, flux, and basic components</li>
              <li>• Safety equipment and ventilation provided</li>
              <li>• Minimum billing: 0.1 hours (6 minutes)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}