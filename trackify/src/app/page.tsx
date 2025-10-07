"use client"
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { DonationForm } from '@/components/DonationForm';
import { PaymentPage } from '@/components/PaymentPage';
import { ReportsSection } from '@/components/ReportSection';
import { AdminPanel } from '@/components/AdminPanel';
import { ServicePreview } from '@/components/ServicePreview';

type AppSection = 'login' | 'dashboard' | 'donations' | 'payments' | 'reports' | 'admin' | 'service-preview';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setCurrentSection('dashboard'); // Return to public dashboard instead of login
  };

  const handleShowLogin = () => {
    setCurrentSection('login');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section as AppSection);
  };

  const handleBackToDashboard = () => {
    setCurrentSection('dashboard');
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentSection('service-preview');
  };

  const handleCheckout = () => {
    setCurrentSection('payments');
  };

  const renderSection = () => {
  switch (currentSection) {
    case 'dashboard':
      return (
        <Dashboard
          username={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onServiceSelect={handleServiceSelect} // important!
        />
      );
    case 'service-preview':
      return (
        <ServicePreview
          serviceId={selectedService}
          onBack={handleBackToDashboard}
          onCheckout={handleCheckout}
        />
      );
    case 'donations':
      return <DonationForm onBack={handleBackToDashboard} />;
    case 'payments':
      return <PaymentPage onBack={handleBackToDashboard} />;
    case 'reports':
      return <ReportsSection onBack={handleBackToDashboard} />;
    case 'admin':
      return <AdminPanel onBack={handleBackToDashboard} />;
    default:
      return (
        <Dashboard
          username={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onServiceSelect={handleServiceSelect} // important!
        />
      );
  }
};

  return (
    <div className="size-full">
      {renderSection()}
    </div>
  );
}