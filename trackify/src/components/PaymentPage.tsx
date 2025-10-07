import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const [paymentData, setPaymentData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Payment processed successfully!');
    setPaymentData({ field1: '', field2: '', field3: '', field4: '' });
  };

  const handleCancel = () => {
    setPaymentData({ field1: '', field2: '', field3: '', field4: '' });
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
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 bg-[#ff8c00] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-white text-sm">SORSOGON COMMUNITY LABS</div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-[#4a5568] rounded-lg p-8">
          <h2 className="text-white text-lg mb-6 text-center">Payment Processing</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  placeholder="Card Number"
                  value={paymentData.field1}
                  onChange={(e) => setPaymentData({ ...paymentData, field1: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Cardholder Name"
                  value={paymentData.field2}
                  onChange={(e) => setPaymentData({ ...paymentData, field2: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.field3}
                  onChange={(e) => setPaymentData({ ...paymentData, field3: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="CVV"
                  value={paymentData.field4}
                  onChange={(e) => setPaymentData({ ...paymentData, field4: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-12"
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center mt-8">
              <Button 
                type="submit" 
                className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-8 h-10"
              >
                PROCESS
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-md px-8 h-10"
              >
                CANCEL
              </Button>
            </div>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="text-[#2d3748] text-lg mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-[#2d3748] font-medium">Transaction #001</p>
                <p className="text-gray-600 text-sm">Credit Card Payment</p>
              </div>
              <div className="text-right">
                <p className="text-[#2d3748] font-medium">$250.00</p>
                <p className="text-green-600 text-sm">Completed</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-[#2d3748] font-medium">Transaction #002</p>
                <p className="text-gray-600 text-sm">Bank Transfer</p>
              </div>
              <div className="text-right">
                <p className="text-[#2d3748] font-medium">$150.00</p>
                <p className="text-yellow-600 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}