import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Printer, FileText, Zap, Wrench, Microchip, Sparkles } from 'lucide-react';

interface DashboardProps {
  username: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onServiceSelect: (service: string) => void;
}

export function Dashboard({ username, onNavigate, onLogout, onServiceSelect }: DashboardProps) {
  
  // Format username for display (convert maria_santos to Maria Santos)
  const formatDisplayName = (username: string) => {
    if (!username) return 'Guest User';
    return username
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine user status and membership display
  const getUserStatus = (username: string) => {
    if (!username) return { displayName: 'Guest User', status: 'guest' };
    
    const displayName = formatDisplayName(username);
    
    // Check if admin user
    if (username.includes('admin')) {
      return { displayName, status: 'Administrator' };
    }
    
    // For other users, show as community member
    return { displayName, status: 'Community Member' };
  };

  const userInfo = getUserStatus(username);
  
  const services = [
    { 
      id: "3d-printer", 
      title: "3D PRINTER", 
      icon: Printer, 
      description: "Professional 3D printing with PLA/ABS filaments. Perfect for prototypes, models, and custom parts.", 
      price: "₱5/hour + filament",
      gradient: "from-purple-500 to-blue-600",
      features: ['PLA and ABS materials', 'High precision printing', 'Design assistance']
    },
    { 
      id: "printer", 
      title: "DOCUMENT PRINTER", 
      icon: FileText, 
      description: "High-quality document printing, scanning, and copying services for all your paper needs.", 
      price: "₱2/page",
      gradient: "from-gray-500 to-slate-600",
      features: ["Color & B&W printing", "Various paper sizes", "Fast processing"]
    },
    { 
      id: "soldering", 
      title: "SOLDERING STATION", 
      icon: Zap, 
      description: "Professional electronic soldering and repair station with temperature control and safety equipment.", 
      price: "₱10/hour",
      gradient: "from-yellow-500 to-orange-600",
      features: ["Temperature control", "Safety equipment", "Component library"]
    },
    { 
      id: "tools", 
      title: "HARDWARE TOOLS", 
      icon: Wrench, 
      description: "Complete workshop with precision tools, measuring instruments, and mechanical equitpmen.", 
      price: "₱5/hour",
      gradient: "from-green-500 to-emerald-600",
      features: ["Precision instruments", "Power tools", "Safety gear included"]
    },
    { 
      id: "components", 
      title: "ELECTRONIC COMPONENTS", 
      icon: Microchip, 
      description: "Arduino, sensors, microcontrollers, and electronic components for your innovation projects.", 
      price: "₱2-50/piece",
      gradient: "from-indigo-500 to-purple-600",
      features: ["Arduino ecosystem", "Sensors & modules", "Project guidance"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#2d3748]">

  <div className="flex flex-col md:flex-row md:justify-between items-center p-5 md:p-6 mb-6 gap-4 md:gap-0">
        <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
      <Image
        src="/img/logo.svg"
        alt="Sorsogon Community Innovation Labs"
        width={64}
        height={64}
        className="w-12 h-12 md:w-16 md:h-16 mr-3"
      />
          <div className="text-center md:text-left">
            <div className="text-white text-lg md:text-2xl font-bold">SORSOGON COMMUNITY</div>
            <div className="text-[#ff8c00] text-lg md:text-2xl font-bold">INNOVATION LABS</div>
          </div>
        </div>
        
        {/* User Info and Logout - Top Right (responsive) */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="text-center md:text-right">
            <div className="text-white text-sm">
              {username ? `Welcome back,` : 'Welcome,'}
            </div>
            <div className="text-[#ff8c00] font-semibold">{userInfo.displayName}</div>
            {username && (
              <div className="text-gray-300 text-xs">{userInfo.status}</div>
            )}
          </div>
          {username ? (
            <Button 
              onClick={onLogout}
              aria-label="Logout"
              className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6 py-3 md:py-2 font-medium transition-colors w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/60"
            >
              Logout
            </Button>
          ) : (
            <Button 
              onClick={() => onNavigate('community')}
              aria-label="Login"
              className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6 py-3 md:py-2 font-medium transition-colors w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/60"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-[#ff8c00] animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-[#ff8c00] to-white bg-clip-text text-transparent">
              INNOVATION LABS SERVICES
            </h1>
            <Sparkles className="h-6 w-6 text-[#ff8c00] animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-transparent via-[#ff8c00]/20 to-transparent h-px w-24 mx-auto mb-4"></div>
          <p className="text-gray-300 text-base md:text-lg mb-3 max-w-2xl mx-auto leading-relaxed">
            Unlock your creative potential with state-of-the-art equipment and professional-grade tools. 
            From rapid prototyping to precision manufacturing.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-[#ff8c00] mb-6">
            <span className="bg-[#ff8c00]/10 px-2 py-1 rounded-full border border-[#ff8c00]/30">• Professional Equipment</span>
            <span className="bg-[#ff8c00]/10 px-2 py-1 rounded-full border border-[#ff8c00]/30">• Expert Guidance</span>
            <span className="bg-[#ff8c00]/10 px-2 py-1 rounded-full border border-[#ff8c00]/30">• Affordable Rates</span>
            <span className="bg-[#ff8c00]/10 px-2 py-1 rounded-full border border-[#ff8c00]/30">• Community Access</span>
          </div>
          
          {/* Service Cards Carousel */}
          <div className="mb-12">
            <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card 
                        className="group bg-gradient-to-br from-[#4a5568] to-[#2d3748] border-gray-600 cursor-pointer 
                                 hover:shadow-2xl hover:shadow-[#ff8c00]/20 transition-all duration-300 
                                 hover:scale-105 hover:border-[#ff8c00]/50 overflow-hidden h-80"
                        onClick={() => onServiceSelect(service.id)}
                      >
                        <CardContent className="p-0 h-full flex flex-col">
                          {/* Icon Header with Gradient */}
                          <div className={`bg-gradient-to-r ${service.gradient} p-4 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="relative z-10 flex flex-row gap-5 items-center">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 
                                            group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-white font-bold text-md text-center leading-tight">
                                {service.title}
                              </h3>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/10 rounded-full"></div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="p-4 flex flex-col flex-grow">
                            <p className="text-gray-300 text-start text-xs mb-3 leading-relaxed flex-grow">
                              {/* {service.description.length > 60 
                                ? service.description.substring(0, 60) + "..."
                                : service.description} */}
                                { service.description}
                            </p>
                            
                            {/* Features */}
                            <div className="mb-3 min-h-[32px]">
                              {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 bg-[#ff8c00] rounded-full"></div>
                                  <span className="text-gray-400 text-xs truncate">{feature}</span>
                                </div>
                              ))}
                            </div>
                            {/* Price */}
                            <div className="flex items-center justify-between mt-auto">
                              <div className="text-[#ff8c00] font-extralight text-sm">
                                {service.price}
                              </div>
                              <div className="text-xs text-gray-500 group-hover:text-[#ff8c00] transition-colors">
                                Click to book →
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="text-white border-gray-600 hover:bg-[#ff8c00] hover:border-[#ff8c00] 
                                         transition-all duration-300 -left-12 bg-[#4a5568]/80 backdrop-blur-sm" />
              <CarouselNext className="text-white border-gray-600 hover:bg-[#ff8c00] hover:border-[#ff8c00] 
                                     transition-all duration-300 -right-12 bg-[#4a5568]/80 backdrop-blur-sm" />
            </Carousel>
          </div>
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <Button 
              onClick={() => window.open('http://innovationlabs.ph/', '_blank')}
              className="bg-gradient-to-r from-[#4a5568] to-[#5a6578] hover:from-[#5a6578] hover:to-[#6a7588] 
                         text-white border-0 rounded-lg h-14 font-semibold transition-all duration-300 
                         hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            >
              OUR PORTAL
            </Button>

            <Button 
              onClick={() => onNavigate('community')}
              className="bg-gradient-to-r from-[#4a5568] to-[#5a6578] hover:from-[#5a6578] hover:to-[#6a7588] 
                         text-white border-0 rounded-lg h-14 font-semibold transition-all duration-300 
                         hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              COMMUNITY
            </Button>

            <Button 
              onClick={() => onNavigate('admin')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                         text-white border-0 rounded-lg h-14 font-semibold transition-all duration-300 
                         hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
            >
              ADMIN
            </Button>

            <Button 
              onClick={() => onNavigate('reports')}
              className="bg-gradient-to-r from-[#4a5568] to-[#5a6578] hover:from-[#5a6578] hover:to-[#6a7588] 
                         text-white border-0 rounded-lg h-14 font-semibold transition-all duration-300 
                         hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
            >
              REPORTS
            </Button>

            <Button 
              onClick={() => onNavigate('payments')}
              className="bg-gradient-to-r from-[#ff8c00] to-[#e67e00] hover:from-[#e67e00] hover:to-[#d67300] 
                         text-white border-0 rounded-lg h-14 font-semibold transition-all duration-300 
                         hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
            >
              PAYMENT
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
}