import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from './ui/carousel';
import logo from '../../public/img/logo.png';

interface DashboardProps {
  username: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onShowLogin: () => void;
  onServiceSelect: (service: string) => void;
}

import React, { useRef, useState } from 'react';

export function Dashboard({ username, onNavigate, onLogout, onShowLogin, onServiceSelect }: DashboardProps) {
  const services = [
    { id: "3d-printer", title: "3D PRINTER", image: "🖨️", description: "3D printing services", price: "$15/hour" },
    { id: "printer", title: "PRINTER", image: "🖨", description: "Document printing", price: "$0.50/page" },
    { id: "soldering", title: "SOLDERING", image: "🔧", description: "Electronic soldering station", price: "$10/hour" },
    { id: "tools", title: "TOOLS", image: "🛠️", description: "Hardware tools rental", price: "$5/hour" },
    { id: "components", title: "COMPONENTS", image: "⚡", description: "Arduino and electronic components", price: "$2-50/piece" }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselApiRef = useRef<CarouselApi | null>(null);

  // Called when Embla API is ready
  const handleSetApi = (api: CarouselApi | undefined) => {
    if (!api) return;
    carouselApiRef.current = api;
    setSelectedIndex(api.selectedScrollSnap());
    api.on('select', () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  };

  const handleDotClick = (idx: number) => {
    if (carouselApiRef.current) {
      carouselApiRef.current.scrollTo(idx);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d3748]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
  <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Image src={logo} alt="Sorsogon Community Innovation Labs" width={48} height={48} className="w-12 h-12 mr-3" />
              <div className="text-left">
                <div className="text-white text-sm">SORSOGON COMMUNITY</div>
                <div className="text-[#ff8c00] text-lg">INNOVATION LABS</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {username ? (
                <>
                  <span className="text-white">Welcome, {username}</span>
                  <Button 
                    onClick={onLogout}
                    className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-white">Already a Member?</span>
                  <Button 
                    onClick={onShowLogin}
                    className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="text-white text-lg mb-8 text-center">TOOL SERVICES</div>
          
          {/* Service Cards Slider */}
          <div className="mb-8">
            <Carousel className="w-full max-w-4xl mx-auto" setApi={handleSetApi}>
              <CarouselContent>
                {services.map((service, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                    <Card 
                      className="bg-[#4a5568] border-gray-600 cursor-pointer hover:bg-[#5a6578] transition-colors"
                      onClick={() => onServiceSelect(service.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{service.image}</div>
                        <div className="text-white text-sm mb-2">{service.title}</div>
                        <div className="text-gray-300 text-xs mb-2">{service.description}</div>
                        <div className="text-[#ff8c00] text-xs">{service.price}</div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-white border-gray-600 hover:bg-[#4a5568]" />
              <CarouselNext className="text-white border-gray-600 hover:bg-[#4a5568]" />
            </Carousel>
          </div>
          {/* Navigation Dots (only 3) */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 border-white focus:outline-none transition-colors ${selectedIndex === idx ? 'bg-white' : 'bg-gray-600'}`}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => handleDotClick(idx)}
                disabled={idx >= services.length}
              />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Button 
              onClick={() => onNavigate('donations')}
              className="bg-[#4a5568] hover:bg-[#5a6578] text-white border-0 rounded-md h-12"
            >
              OUR PORTAL
            </Button>
            <Button 
              onClick={() => onNavigate('reports')}
              className="bg-[#4a5568] hover:bg-[#5a6578] text-white border-0 rounded-md h-12"
            >
              Transaction History
            </Button>
            <Button 
              onClick={() => onNavigate('payments')}
              className="bg-[#4a5568] hover:bg-[#5a6578] text-white border-0 rounded-md h-12"
            >
              PAYMENT
            </Button>
            <Button 
              onClick={() => onNavigate('admin')}
              className="bg-[#4a5568] hover:bg-[#5a6578] text-white border-0 rounded-md h-12"
            >
              Donate
            </Button>
          </div>
        </div>
      
      </div>
    </div>
  );
}