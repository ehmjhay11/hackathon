import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Shield, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

export function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_CREDENTIALS = {
    username: 'admin_sorsogon',
    email: 'admin@sorsogonlabs.gov.ph'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate credentials
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.email === ADMIN_CREDENTIALS.email
    ) {
      // Store admin session
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_session', JSON.stringify({
        username: credentials.username,
        loginTime: new Date().toISOString()
      }));
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError('Invalid admin credentials. Access denied.');
      }, 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-[#1a202c] border-gray-600">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center text-white flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-[#ff8c00]" />
            Admin Access
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Restricted to authorized personnel only
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Admin Username
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter admin username"
                className="bg-[#2d3748] border-gray-600 text-white placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter admin email"
                className="bg-[#2d3748] border-gray-600 text-white placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-600 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <p className="text-blue-400 text-sm font-semibold">Security Notice</p>
            </div>
            <p className="text-blue-300 text-xs">
              This area is restricted to authorized Innovation Labs administrators only. 
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function to check admin authentication
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isAuth = localStorage.getItem('admin_authenticated');
  const session = localStorage.getItem('admin_session');
  
  if (!isAuth || !session) return false;
  
  try {
    const sessionData = JSON.parse(session);
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    
    // Session expires after 8 hours
    if (hoursSinceLogin > 8) {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_session');
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Utility function to clear admin session
export const clearAdminSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session');
  }
};