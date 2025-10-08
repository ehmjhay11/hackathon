"use client"
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { PaymentServiceType } from '@/types';
import { DonationForm } from '@/components/DonationForm';
import { PaymentPage } from '@/components/PaymentPage';
import { ReportSection } from '@/components/ReportSection';
import { AdminPanel } from '@/components/AdminPanel';
import { ServicePreview } from '@/components/ServicePreview';
import { LoginPage } from '@/components/LoginPage';

type AppSection = 'login' | 'dashboard' | 'donations' | 'payments' | 'reports' | 'admin' | 'service-preview' | 'community';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  // map dashboard service ids to PaymentServiceType used by PaymentPage
  const serviceToPaymentMap: Record<string, string> = {
    '3d-printer': '3d-printer',
    'printer': 'document-printer', // document printer goes to new document printer payment form
    'soldering': 'soldering-station',
    'tools': 'tools',
    'components': 'components'
  };

  const handleLogout = () => {
    setCurrentUser('');
    setCurrentSection('dashboard'); // Return to public dashboard instead of login
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section as AppSection);
  };

  const handleBackToDashboard = () => {
    // clear any previously selected service so payments isn't pre-seeded
    setSelectedService('');
    setCurrentSection('dashboard');
  };

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setCurrentSection('dashboard'); // Ensure we go back to dashboard after login
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentSection('service-preview');
  };

  const handleCheckout = (serviceId?: string) => {
    if (serviceId) {
      // store desired service in selectedService so we can pass to PaymentPage
      setSelectedService(serviceId);
    }
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
          onCheckout={(id?: string) => handleCheckout(id ?? selectedService)}
        />
      );
    case 'donations':
      return <DonationForm onBack={handleBackToDashboard} />;
    case 'payments':
      // translate selectedService to PaymentServiceType or 'donation'
  const mapped = (serviceToPaymentMap[selectedService] ?? (selectedService === 'donation' ? 'donation' : undefined)) as PaymentServiceType | 'donation' | 'document-printer' | undefined;
  return <PaymentPage onBack={handleBackToDashboard} initialService={mapped} />;
    case 'reports':
      return <ReportSection onBack={handleBackToDashboard} />;
    case 'admin':
      return <AdminPanel onBack={handleBackToDashboard} />;
    case 'community':
      return <LoginPage onBack={handleBackToDashboard} onLogin={handleLoginSuccess} />;
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