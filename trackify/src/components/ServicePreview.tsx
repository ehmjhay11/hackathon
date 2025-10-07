import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Clock, DollarSign, Info } from 'lucide-react';
import Image from "next/image";
import { Printer, FileText, Zap, Wrench, Microchip, LucideIcon } from 'lucide-react';

interface ServicePreviewProps {
  serviceId: string;
  onBack: () => void;
  onCheckout: (serviceId?: string) => void;
}

export function ServicePreview({ serviceId, onBack, onCheckout }: ServicePreviewProps) {
  const serviceDetails = {
    '3d-printer': {
      title: '3D PRINTER',
      icon: '🖨️',
      basePrice: 5,
      unit: 'hour',
      description: 'Professional 3D printing with PLA/ABS filaments. Perfect for prototypes, models, and custom parts.',
      features: ['PLA and ABS materials', 'High precision printing', 'Design assistance'],
      estimatedTime: '2-6 hours',
      additionalCosts: [
        { item: 'PLA Material', price: 5, unit: '100g' },
        { item: 'ABS Material', price: 7, unit: '100g' },
        { item: 'Design Review', price: 20, unit: 'session' }
      ]
    },
    'printer': {
      title: 'PRINTER',
      icon: '🖨',
      basePrice: 2,
      unit: 'page',
      description: 'High-quality document printing, scanning, and copying services for all your paper needs.',
      features: ["Color & B&W printing", "Various paper sizes", "Fast processing"],
      estimatedTime: '5-15 minutes',
      additionalCosts: [
        { item: 'Color Printing', price: 0.75, unit: 'page' },
        { item: 'Premium Paper', price: 0.25, unit: 'page' },
        { item: 'Binding Service', price: 2, unit: 'document' }
      ]
    },
    'soldering': {
      title: 'SOLDERING',
      icon: '🔧',
      basePrice: 10,
      unit: 'hour',
      description: 'Professional electronic soldering and repair station with temperature control and safety equipment.',
      features: ["Temperature control", "Safety equipment", "Component library"],
      estimatedTime: '1-4 hours',
      additionalCosts: [
        { item: 'Solder Wire', price: 3, unit: 'roll' },
        { item: 'Flux', price: 2, unit: 'bottle' },
        { item: 'Desoldering Braid', price: 2, unit: 'roll' }
      ]
    },
    'tools': {
      title: 'HARDWARE TOOLS',
      icon: '🛠️',
      basePrice: 5,
      unit: 'hour',
      description: 'Complete workshop with precision tools, measuring instruments, and mechanical equitpmen.',
      features: ["Precision instruments", "Power tools", "Safety gear included"],
      estimatedTime: '1-8 hours',
      additionalCosts: [
        { item: 'Drill Bits Set', price: 3, unit: 'set' },
        { item: 'Sandpaper Pack', price: 2, unit: 'pack' },
        { item: 'Safety Gloves', price: 1, unit: 'pair' }
      ]
    },
    'components': {
      title: 'COMPONENTS',
      icon: '⚡',
      basePrice: 50,
      unit: 'piece',
      description: 'Arduino boards, sensors, and electronic components for your projects.',
      features: ["Arduino ecosystem", "Sensors & modules", "Project guidance"],
      estimatedTime: 'Immediate',
      additionalCosts: [
        { item: 'Arduino Uno', price: 25, unit: 'board' },
        { item: 'Sensor Kit', price: 15, unit: 'kit' },
        { item: 'Jumper Wires', price: 3, unit: 'pack' }
      ]
    }
  };

  const service = serviceDetails[serviceId as keyof typeof serviceDetails];

  const iconMap: Record<string, LucideIcon | undefined> = {
    '3d-printer': Printer,
    'printer': FileText,
    'soldering': Wrench,
    'tools': Zap,
    'components': Microchip,
  };

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#2d3748]">
      <div className="max-w-4xl mx-auto p-8">
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

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <Card className="bg-[#4a5568] border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                {/* Icon container styled like dashboard */}
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 mr-3">
                  {(() => {
                    const IconComponent = iconMap[serviceId];
                    if (IconComponent) {
                      return <IconComponent className="w-6 h-6 text-white" />;
                    }
                    return <span className="text-2xl">{service.icon}</span>;
                  })()}
                </div>
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">{service.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-white">
                  <DollarSign className="h-4 w-4 mr-2 text-[#ff8c00]" />
                  <span>Base Price: ${service.basePrice} per {service.unit}</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-2 text-[#ff8c00]" />
                  <span>Estimated Time: {service.estimatedTime}</span>
                </div>
              </div>

              <div>
                <h4 className="text-white mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-[#ff8c00]" />
                  Features Included:
                </h4>
                <ul className="text-gray-300 space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-[#ff8c00] rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Checkout */}
          <Card className="bg-[#4a5568] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Pricing & Add-ons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#2d3748] p-4 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-2xl text-[#ff8c00] mb-1">${service.basePrice}</div>
                  <div className="text-gray-300">per {service.unit}</div>
                </div>
              </div>

              <div>
                <h4 className="text-white mb-3">Optional Add-ons:</h4>
                <div className="space-y-2">
                  {service.additionalCosts.map((cost, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{cost.item}</span>
                      <span className="text-white">${cost.price}/{cost.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <Button 
                  onClick={() => onCheckout(serviceId)}
                  className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md h-12"
                >
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Final pricing will be calculated during checkout
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}