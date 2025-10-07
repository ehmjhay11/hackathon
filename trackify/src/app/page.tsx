"use client"
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { DonationForm } from '@/components/DonationForm';
import { PaymentPage } from '@/components/PaymentPage';
import { ReportsSection } from '@/components/ReportSection';
import { AdminPanel } from '@/components/AdminPanel';

type AppSection = 'login' | 'dashboard' | 'donations' | 'payments' | 'reports' | 'admin';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>('login');
  const [currentUser, setCurrentUser] = useState<string>('');

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setCurrentSection('login');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section as AppSection);
  };

  const handleBackToDashboard = () => {
    setCurrentSection('dashboard');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Dashboard
            username={currentUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
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