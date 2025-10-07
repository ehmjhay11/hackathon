import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Calculator, Printer } from 'lucide-react';
import Image from "next/image";
import { FilamentType, PrinterPaymentData, ServiceRates, FilamentPrice } from '@/types';

// Service rates and prices - constants outside component to avoid useEffect dependencies
const SERVICE_RATES: ServiceRates = {
  power: 5, // ₱5/hour
  soldering: 10, // ₱10/hour
  spoolWeight: 1000 // 1000g per spool
};

const FILAMENT_PRICES: FilamentPrice = {
  PLA: 1200, // ₱1200 / 1kg spool
  ABS: 1350  // ₱1350 / 1kg spool
};

interface PrinterPaymentFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function PrinterPaymentForm({ onBack, onComplete }: PrinterPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    filamentWeight: '',
    filamentType: '' as FilamentType | '',
    printingTime: '',
    paymentMethod: '' as 'cash' | 'card' | 'bank_transfer' | ''
  });

  const [calculations, setCalculations] = useState<PrinterPaymentData>({
    filamentWeight: 0,
    filamentType: 'PLA',
    printingTime: 0,
    filamentCost: 0,
    powerCost: 0,
    totalCost: 0
  });

  // Calculate costs whenever form data changes
  useEffect(() => {
    const weight = parseFloat(formData.filamentWeight) || 0;
    const time = parseFloat(formData.printingTime) || 0;
    const type = formData.filamentType as FilamentType || 'PLA';

    const filamentCost = (weight / SERVICE_RATES.spoolWeight) * FILAMENT_PRICES[type];
    const powerCost = time * SERVICE_RATES.power;
    const totalCost = filamentCost + powerCost;

    setCalculations({
      filamentWeight: weight,
      filamentType: type,
      printingTime: time,
      filamentCost: filamentCost,
      powerCost: powerCost,
      totalCost: totalCost
    });
  }, [formData.filamentWeight, formData.filamentType, formData.printingTime]);

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
      if (!formData.filamentWeight || parseFloat(formData.filamentWeight) <= 0) {
        throw new Error('Please enter a valid filament weight');
      }
      if (!formData.filamentType) {
        throw new Error('Please select a filament type');
      }
      if (!formData.printingTime || parseFloat(formData.printingTime) <= 0) {
        throw new Error('Please enter a valid printing time');
      }
      if (!formData.paymentMethod) {
        throw new Error('Please select a payment method');
      }

      // Submit payment
      const paymentData = {
        userId: 'current-user', // This should come from auth context
        serviceName: '3d-printer',
        description: `3D Printing: ${calculations.filamentWeight}g ${calculations.filamentType}, ${calculations.printingTime}h`,
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
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">3D Printer Payment</h2>
              <p className="text-gray-300 text-sm">Calculate cost based on filament usage and printing time</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Filament Weight */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Filament Weight Used (grams)
              </label>
              <Input
                type="number"
                value={formData.filamentWeight}
                onChange={(e) => handleInputChange('filamentWeight', e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
                placeholder="Enter weight in grams"
                min="1"
                step="1"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Filament Type */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Filament Type
              </label>
              <Select 
                value={formData.filamentType} 
                onValueChange={(value) => handleInputChange('filamentType', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]">
                  <SelectValue placeholder="Select filament type" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3748] border-gray-600">
                  <SelectItem value="PLA" className="text-white focus:bg-[#4a5568]">
                    PLA - ₱{FILAMENT_PRICES.PLA.toLocaleString()} / 1kg spool
                  </SelectItem>
                  <SelectItem value="ABS" className="text-white focus:bg-[#4a5568]">
                    ABS - ₱{FILAMENT_PRICES.ABS.toLocaleString()} / 1kg spool
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Printing Time */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Printing Time (hours)
              </label>
              <Input
                type="number"
                value={formData.printingTime}
                onChange={(e) => handleInputChange('printingTime', e.target.value)}
                className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
                placeholder="Enter printing time in hours"
                min="0.1"
                step="0.1"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Cost Breakdown */}
            <Card className="bg-[#2d3748] border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-[#ff8c00]" />
                  <h3 className="text-white font-semibold">Cost Breakdown</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Filament Cost:</span>
                    <span>₱{calculations.filamentCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Power Cost ({calculations.printingTime}h × ₱{SERVICE_RATES.power}/h):</span>
                    <span>₱{calculations.powerCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-[#ff8c00]">₱{calculations.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
}