import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Printer, Zap, Wrench, Microchip, Heart } from 'lucide-react';
import Image from "next/image";
import { PaymentServiceType } from '@/types';
import { PrinterPaymentForm } from './payment/PrinterPaymentForm';
import { SolderingPaymentForm } from './payment/SolderingPaymentForm';
import { ToolsComponentsPaymentForm } from './payment/ToolsComponentsPaymentForm';
import { SimpleDonationForm } from './SimpleDonationForm';

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const [selectedService, setSelectedService] = useState<PaymentServiceType | 'donation' | null>(null);

  const services = [
    {
      id: '3d-printer' as PaymentServiceType,
      title: '3D PRINTER',
      icon: Printer,
      description: 'Calculate cost based on filament usage and printing time',
      basePrice: 'Variable pricing',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'soldering-station' as PaymentServiceType,
      title: 'SOLDERING STATION',
      icon: Zap,
      description: 'Hourly rate for soldering station usage',
      basePrice: '₱10/hour',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      id: 'tools' as PaymentServiceType,
      title: 'TOOLS',
      icon: Wrench,
      description: 'Select from available tools and equipment',
      basePrice: 'Variable pricing',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'components' as PaymentServiceType,
      title: 'COMPONENTS',
      icon: Microchip,
      description: 'Select electronic components and parts',
      basePrice: 'Variable pricing',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'donation' as const,
      title: 'DONATION',
      icon: Heart,
      description: 'Support our cause and community programs',
      basePrice: 'Any amount',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const handleServiceSelect = (serviceType: PaymentServiceType | 'donation') => {
    setSelectedService(serviceType);
  };

  const handleBackToSelection = () => {
    setSelectedService(null);
  };

  const renderPaymentForm = () => {
    switch (selectedService) {
      case '3d-printer':
        return <PrinterPaymentForm onBack={handleBackToSelection} onComplete={onBack} />;
      case 'soldering-station':
        return <SolderingPaymentForm onBack={handleBackToSelection} onComplete={onBack} />;
      case 'tools':
      case 'components':
        return <ToolsComponentsPaymentForm 
          serviceType={selectedService} 
          onBack={handleBackToSelection} 
          onComplete={onBack} 
        />;
      case 'donation':
        return <SimpleDonationForm onBack={handleBackToSelection} />;
      default:
        return null;
    }
  };

  if (selectedService) {
    return renderPaymentForm();
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
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Button
          onClick={onBack}
          className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Service Selection */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl font-bold mb-4">Select Payment Service</h1>
          <p className="text-gray-300 text-lg">Choose what you&apos;d like to pay for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.id}
                className="bg-[#4a5568] border-gray-600 cursor-pointer hover:bg-[#5a6578] transition-all transform hover:scale-105 h-64"
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    {service.description.length > 50 
                      ? service.description.substring(0, 50) + "..."
                      : service.description}
                  </p>
                  
                  <div className="text-[#ff8c00] font-semibold mt-auto">
                    {service.basePrice}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-[#4a5568] rounded-lg p-6 border border-gray-600 max-w-2xl mx-auto">
            <h3 className="text-white text-lg font-semibold mb-3">Payment Information</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• All transactions are recorded with timestamps</p>
              <p>• Payment methods: Cash, Card, Bank Transfer</p>
              <p>• Contact the lab administrator for assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}