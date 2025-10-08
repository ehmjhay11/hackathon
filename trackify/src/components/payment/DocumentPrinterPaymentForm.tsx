import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Calculator, FileText, Plus, Minus } from 'lucide-react';
import Image from "next/image";

interface DocumentPrintJob {
  id: string;
  pages: number;
  paperSize: 'A4' | 'A3' | 'Letter';
  printType: 'black_white' | 'color';
  paperType: 'standard' | 'premium';
  copies: number;
}

interface DocumentPrinterData {
  jobs: DocumentPrintJob[];
  bindingService: boolean;
  totalPages: number;
  totalCost: number;
  breakdown: {
    printingCost: number;
    paperCost: number;
    bindingCost: number;
  };
}

// Pricing constants
const PRICING = {
  blackWhite: {
    A4: 2,
    A3: 4,
    Letter: 2
  },
  color: {
    A4: 5,
    A3: 10,
    Letter: 5
  },
  premiumPaper: {
    A4: 2,
    A3: 3,
    Letter: 2
  },
  binding: 50 // per document
};

interface DocumentPrinterPaymentFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function DocumentPrinterPaymentForm({ onBack, onComplete }: DocumentPrinterPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    paymentMethod: '' as 'cash' | 'card' | 'bank_transfer' | ''
  });

  const [printData, setPrintData] = useState<DocumentPrinterData>({
    jobs: [{
      id: '1',
      pages: 1,
      paperSize: 'A4',
      printType: 'black_white',
      paperType: 'standard',
      copies: 1
    }],
    bindingService: false,
    totalPages: 0,
    totalCost: 0,
    breakdown: {
      printingCost: 0,
      paperCost: 0,
      bindingCost: 0
    }
  });

  // Calculate costs whenever print data changes
  useEffect(() => {
    let totalPages = 0;
    let printingCost = 0;
    let paperCost = 0;

    printData.jobs.forEach(job => {
      const jobPages = job.pages * job.copies;
      totalPages += jobPages;

      // Calculate printing cost
      const baseRate = job.printType === 'color' 
        ? PRICING.color[job.paperSize] 
        : PRICING.blackWhite[job.paperSize];
      printingCost += jobPages * baseRate;

      // Calculate paper cost (only for premium)
      if (job.paperType === 'premium') {
        paperCost += jobPages * PRICING.premiumPaper[job.paperSize];
      }
    });

    const bindingCost = printData.bindingService ? PRICING.binding : 0;
    const totalCost = printingCost + paperCost + bindingCost;

    setPrintData(prev => ({
      ...prev,
      totalPages,
      totalCost,
      breakdown: {
        printingCost,
        paperCost,
        bindingCost
      }
    }));
  }, [printData.jobs, printData.bindingService]);

  const addPrintJob = () => {
    const newJob: DocumentPrintJob = {
      id: Date.now().toString(),
      pages: 1,
      paperSize: 'A4',
      printType: 'black_white',
      paperType: 'standard',
      copies: 1
    };
    setPrintData(prev => ({
      ...prev,
      jobs: [...prev.jobs, newJob]
    }));
  };

  const removePrintJob = (jobId: string) => {
    if (printData.jobs.length > 1) {
      setPrintData(prev => ({
        ...prev,
        jobs: prev.jobs.filter(job => job.id !== jobId)
      }));
    }
  };

  const updateJob = (jobId: string, updates: Partial<DocumentPrintJob>) => {
    setPrintData(prev => ({
      ...prev,
      jobs: prev.jobs.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (printData.totalCost <= 0) {
      setError('Please add at least one print job');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const paymentData = {
        service: 'document-printer',
        ...printData,
        paymentMethod: formData.paymentMethod,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment submission failed');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d3748] text-white">
      {/* Header */}
      <div className="bg-[#1a202c] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/file.svg"
                alt="Innovation Labs Logo"
                width={36}
                height={36}
                className="mr-3"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Innovation Labs</h1>
                <p className="text-[#ff8c00] text-xs">Document Printer Payment</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 bg-transparent border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00] hover:text-white transition-colors text-sm px-3 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Service Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Document Printer Service</h2>
              <p className="text-white/90">High-quality document printing, scanning, and copying services</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Print Jobs */}
          <Card className="bg-[#1a202c] border-gray-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Print Jobs</h3>
                <Button
                  type="button"
                  onClick={addPrintJob}
                  className="bg-[#ff8c00] hover:bg-[#e67e00] text-white flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Job</span>
                </Button>
              </div>

              <div className="space-y-4">
                {printData.jobs.map((job, index) => (
                  <div key={job.id} className="bg-[#2d3748] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Print Job {index + 1}</h4>
                      {printData.jobs.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePrintJob(job.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Pages</label>
                        <Input
                          type="number"
                          min="1"
                          value={job.pages}
                          onChange={(e) => updateJob(job.id, { pages: parseInt(e.target.value) || 1 })}
                          className="bg-[#4a5568] border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Copies</label>
                        <Input
                          type="number"
                          min="1"
                          value={job.copies}
                          onChange={(e) => updateJob(job.id, { copies: parseInt(e.target.value) || 1 })}
                          className="bg-[#4a5568] border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Paper Size</label>
                        <Select
                          value={job.paperSize}
                          onValueChange={(value: 'A4' | 'A3' | 'Letter') => updateJob(job.id, { paperSize: value })}
                        >
                          <SelectTrigger className="bg-[#4a5568] border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="A3">A3</SelectItem>
                            <SelectItem value="Letter">Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Print Type</label>
                        <Select
                          value={job.printType}
                          onValueChange={(value: 'black_white' | 'color') => updateJob(job.id, { printType: value })}
                        >
                          <SelectTrigger className="bg-[#4a5568] border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black_white">Black & White</SelectItem>
                            <SelectItem value="color">Color</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Paper Type</label>
                        <Select
                          value={job.paperType}
                          onValueChange={(value: 'standard' | 'premium') => updateJob(job.id, { paperType: value })}
                        >
                          <SelectTrigger className="bg-[#4a5568] border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Subtotal</div>
                          <div className="text-lg font-bold text-[#ff8c00]">
                            ₱{((job.pages * job.copies) * 
                              (job.printType === 'color' ? PRICING.color[job.paperSize] : PRICING.blackWhite[job.paperSize]) +
                              (job.paperType === 'premium' ? (job.pages * job.copies) * PRICING.premiumPaper[job.paperSize] : 0)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Binding Service */}
              <div className="mt-6 p-4 bg-[#2d3748] rounded-lg">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={printData.bindingService}
                    onChange={(e) => setPrintData(prev => ({ ...prev, bindingService: e.target.checked }))}
                    className="w-4 h-4 text-[#ff8c00] bg-[#4a5568] border-gray-600 rounded focus:ring-[#ff8c00]"
                  />
                  <span className="text-white">Add Professional Binding Service (+₱50)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card className="bg-[#1a202c] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-[#ff8c00]" />
                Cost Breakdown
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Total Pages</span>
                  <span className="text-white font-medium">{printData.totalPages}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Printing Cost</span>
                  <span className="text-white font-medium">₱{printData.breakdown.printingCost.toFixed(2)}</span>
                </div>
                {printData.breakdown.paperCost > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Premium Paper</span>
                    <span className="text-white font-medium">₱{printData.breakdown.paperCost.toFixed(2)}</span>
                  </div>
                )}
                {printData.breakdown.bindingCost > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-600">
                    <span className="text-gray-300">Binding Service</span>
                    <span className="text-white font-medium">₱{printData.breakdown.bindingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 bg-[#2d3748] rounded-lg px-4">
                  <span className="text-xl font-bold text-white">Total Cost</span>
                  <span className="text-2xl font-bold text-[#ff8c00]">₱{printData.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-[#1a202c] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
              
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: 'cash' | 'card' | 'bank_transfer') => 
                  setFormData(prev => ({ ...prev, paymentMethod: value }))
                }
              >
                <SelectTrigger className="bg-[#4a5568] border-gray-600 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || printData.totalCost <= 0}
            className="w-full bg-gradient-to-r from-[#ff8c00] to-[#ffa500] hover:from-[#ffa500] hover:to-[#ff8c00] text-white font-semibold py-3 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Processing Payment...' : `Complete Payment - ₱${printData.totalCost.toFixed(2)}`}
          </Button>
        </form>
      </div>
    </div>
  );
}