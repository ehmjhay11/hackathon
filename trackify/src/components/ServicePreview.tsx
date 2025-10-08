import { Button } from './ui/button';
import { ArrowLeft, Clock, CheckCircle, Star, Info } from 'lucide-react';
import Image from "next/image";
import { Printer, FileText, Zap, Wrench, Microchip } from 'lucide-react';

interface ServicePreviewProps {
  serviceId: string;
  onBack: () => void;
  onCheckout: (serviceId?: string) => void;
}

export function ServicePreview({ serviceId, onBack, onCheckout }: ServicePreviewProps) {
  const serviceDetails = {
    '3d-printer': {
      title: '3D PRINTER',
      icon: Printer,
      gradient: 'from-blue-500 to-cyan-600',
      basePrice: '₱5/hour + materials',
      description: 'Professional 3D printing with PLA/ABS filaments. Perfect for prototypes, models, and custom parts.',
      features: ['PLA and ABS materials', 'High precision printing', 'Design assistance', 'Post-processing support'],
      estimatedTime: '2-6 hours',
      specs: [
        { label: 'Build Volume', value: '220×220×250mm' },
        { label: 'Layer Resolution', value: '0.1-0.3mm' },
        { label: 'Filament Types', value: 'PLA, ABS, PETG' },
        { label: 'Support Material', value: 'Available' }
      ],
      additionalCosts: [
        { item: 'PLA Material', price: '₱1.2/g', description: 'High-quality PLA filament' },
        { item: 'ABS Material', price: '₱1.35/g', description: 'Durable ABS filament' },
        { item: 'Design Review', price: '₱300/session', description: 'Professional design consultation' }
      ]
    },
    'printer': {
      title: 'DOCUMENT PRINTER',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-600',
      basePrice: '₱2-5/page',
      description: 'High-quality document printing, scanning, and copying services for all your paper needs.',
      features: ['Color & B&W printing', 'Multiple paper sizes', 'Fast processing', 'Scanning services'],
      estimatedTime: '5-15 minutes',
      specs: [
        { label: 'Print Quality', value: 'Up to 1200 DPI' },
        { label: 'Paper Sizes', value: 'A4, A3, Letter' },
        { label: 'Color Options', value: 'Full color, B&W' },
        { label: 'Capacity', value: 'Bulk printing available' }
      ],
      additionalCosts: [
        { item: 'Color Printing', price: '₱5/page', description: 'Full color documents' },
        { item: 'Premium Paper', price: '₱2/page', description: 'High-quality paper stock' },
        { item: 'Binding Service', price: '₱50/document', description: 'Professional binding' }
      ]
    },
    'soldering': {
      title: 'SOLDERING STATION',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600',
      basePrice: '₱10/hour',
      description: 'Professional electronic soldering and repair station with temperature control and safety equipment.',
      features: ['Temperature control', 'Safety equipment', 'Component library', 'Expert guidance'],
      estimatedTime: '1-4 hours',
      specs: [
        { label: 'Temperature Range', value: '200-450°C' },
        { label: 'Station Type', value: 'Digital controlled' },
        { label: 'Safety Features', value: 'Auto shutoff, ventilation' },
        { label: 'Tools Included', value: 'Multiple tip sizes' }
      ],
      additionalCosts: [
        { item: 'Solder Wire', price: '₱150/roll', description: 'Lead-free solder wire' },
        { item: 'Flux', price: '₱80/bottle', description: 'Rosin flux paste' },
        { item: 'Desoldering Braid', price: '₱120/roll', description: 'Copper desoldering wick' }
      ]
    },
    'tools': {
      title: 'HARDWARE TOOLS',
      icon: Wrench,
      gradient: 'from-green-500 to-emerald-600',
      basePrice: '₱15/hour',
      description: 'Complete workshop with precision tools, measuring instruments, and mechanical equipment.',
      features: ['Precision instruments', 'Power tools', 'Safety gear included', 'Tool training available'],
      estimatedTime: '1-8 hours',
      specs: [
        { label: 'Tool Categories', value: 'Hand, power, precision' },
        { label: 'Measurement Tools', value: 'Calipers, multimeters' },
        { label: 'Safety Equipment', value: 'Goggles, gloves, aprons' },
        { label: 'Work Space', value: 'Dedicated bench space' }
      ],
      additionalCosts: [
        { item: 'Drill Bits Set', price: '₱200/set', description: 'HSS drill bit set' },
        { item: 'Sandpaper Pack', price: '₱100/pack', description: 'Assorted grits' },
        { item: 'Safety Equipment', price: '₱150/set', description: 'Personal protective equipment' }
      ]
    },
    'components': {
      title: 'ELECTRONIC COMPONENTS',
      icon: Microchip,
      gradient: 'from-indigo-500 to-purple-600',
      basePrice: '₱50-2000/item',
      description: 'Arduino boards, sensors, microcontrollers, and electronic components for your innovation projects.',
      features: ['Arduino ecosystem', 'Sensors & modules', 'Project guidance', 'Bulk discounts available'],
      estimatedTime: 'Immediate',
      specs: [
        { label: 'Board Types', value: 'Arduino, ESP32, Raspberry Pi' },
        { label: 'Sensor Categories', value: 'Temperature, motion, distance' },
        { label: 'Components', value: 'Resistors, capacitors, LEDs' },
        { label: 'Documentation', value: 'Tutorials and guides included' }
      ],
      additionalCosts: [
        { item: 'Arduino Uno R3', price: '₱680/board', description: 'Microcontroller development board' },
        { item: 'Sensor Kit', price: '₱450/kit', description: 'Assorted sensors for projects' },
        { item: 'Jumper Wires', price: '₱120/pack', description: 'Male-to-male/female connectors' }
      ]
    }
  };

  const service = serviceDetails[serviceId as keyof typeof serviceDetails];

  if (!service) {
    return (
      <div className="min-h-screen bg-[#2d3748] flex items-center justify-center">
        <div className="text-white text-xl">Service not found</div>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-[#2d3748] text-white">
      {/* Header - Consistent with Dashboard */}
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
                <p className="text-[#ff8c00] text-xs">Service Details</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 bg-transparent border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00] hover:text-white transition-colors text-sm px-3 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Services</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Service Hero Section */}
        <div className={`bg-gradient-to-r ${service.gradient} rounded-xl p-6 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{service.title}</h2>
                <p className="text-white/90 text-base mb-3">{service.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold text-sm">{service.basePrice}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-white" />
                    <span className="text-white text-sm">{service.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Details */}
          <div className="space-y-4">
            {/* Features */}
            <div className="bg-[#1a202c] rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-[#ff8c00]" />
                Features & Benefits
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#1a202c] rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-[#ff8c00]" />
                Specifications
              </h3>
              <div className="space-y-2">
                {service.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-600 last:border-b-0">
                    <span className="text-gray-300 text-sm">{spec.label}</span>
                    <span className="text-white font-medium text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Checkout */}
          <div className="space-y-4">
            {/* Base Pricing */}
            <div className="bg-[#1a202c] rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Base Pricing</h3>
              <div className="bg-[#2d3748] rounded-lg p-3 mb-3">
                <div className="text-xl font-bold text-[#ff8c00] mb-1">{service.basePrice}</div>
                <div className="text-gray-300 text-xs">Starting rate for {service.title.toLowerCase()}</div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="bg-[#1a202c] rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Additional Options</h3>
              <div className="space-y-2">
                {service.additionalCosts.map((cost, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 bg-[#2d3748] rounded-lg">
                    <div>
                      <div className="text-white font-medium text-sm">{cost.item}</div>
                      <div className="text-gray-400 text-xs">{cost.description}</div>
                    </div>
                    <span className="text-[#ff8c00] font-semibold text-sm">{cost.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => onCheckout(serviceId)}
              className="w-full bg-gradient-to-r from-[#ff8c00] to-[#ffa500] hover:from-[#ffa500] hover:to-[#ff8c00] text-white font-semibold py-3 text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}