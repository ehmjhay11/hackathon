import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface DashboardProps {
  username: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onServiceSelect: (service: string) => void;
}

export function Dashboard({ username, onNavigate, onLogout, onServiceSelect }: DashboardProps) {
  const services = [
    { title: "TOOL SERVICES", image: "📱", description: "Digital tools and resources" },
    { title: "MEMORY", image: "💾", description: "Data storage and backup" },
    { title: "PAYMENT", image: "💳", description: "Financial transactions" }
  ];

  return (
    <div className="min-h-screen bg-[#2d3748]">

      <div className="flex p-6 mb-6">
        <Image
            src="/img/logo.png"
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          
          <div className="text-white text-lg mb-8">TOOL SERVICES</div>
          
          {/* Service Cards Slider */}
          <div className="mb-8">
            <Carousel className="w-full max-w-4xl mx-auto">
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
          
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
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
              MEMORY
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
              COMMUNITY
            </Button>
          </div>
        </div>
        
        {/* User Info and Logout */}
        <div className="text-center">
          <div className="text-white mb-4">Welcome, {username}</div>
          <Button 
            onClick={onLogout}
            className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}