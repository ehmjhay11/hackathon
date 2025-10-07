import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Settings, Users, Shield } from 'lucide-react';
import { Switch } from './ui/switch';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoBackup: true,
    twoFactorAuth: false,
    maintenanceMode: false
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert('User added successfully!');
    setNewUser({ name: '', email: '', role: '' });
  };

  return (
    <div className="min-h-screen bg-[#2d3748]">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 text-white hover:text-[#ff8c00] hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <div className="w-6 h-6 bg-[#ff8c00] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-white text-sm">SORSOGON COMMUNITY LABS</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Settings */}
          <div className="bg-[#4a5568] rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-5 w-5 text-[#ff8c00] mr-2" />
              <h2 className="text-white text-lg">System Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-gray-300 text-sm">Send email alerts for system events</p>
                </div>
                <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                        setSettings({ ...settings, emailNotifications: checked })
                    }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Automatic Backup</p>
                  <p className="text-gray-300 text-sm">Daily backup of system data</p>
                </div>
                <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked: boolean) =>
                        setSettings({ ...settings, autoBackup: checked })
                    }
                />

              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Two-Factor Authentication</p>
                  <p className="text-gray-300 text-sm">Require 2FA for all users</p>
                </div>
                <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked: boolean) =>
                        setSettings({ ...settings, twoFactorAuth: checked })
                    }
                />

              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Maintenance Mode</p>
                  <p className="text-gray-300 text-sm">Temporarily disable system access</p>
                </div>
                <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked: boolean) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                    }
                />
              </div>

              <Button className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white mt-6">
                Save Settings
              </Button>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-[#4a5568] rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Users className="h-5 w-5 text-[#ff8c00] mr-2" />
              <h2 className="text-white text-lg">User Management</h2>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-10"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-10"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Role (Admin, Manager, User)"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  required
                  className="w-full bg-white text-black border-0 rounded-md h-10"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white"
              >
                Add User
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <h3 className="text-white">Active Users</h3>
              <div className="space-y-2">
                <div className="bg-[#5a6578] p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="text-white">Admin User</p>
                    <p className="text-gray-300 text-sm">admin@sorsogon.gov</p>
                  </div>
                  <span className="text-[#ff8c00] text-sm">Administrator</span>
                </div>
                <div className="bg-[#5a6578] p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="text-white">Lab Manager</p>
                    <p className="text-gray-300 text-sm">manager@sorsogon.gov</p>
                  </div>
                  <span className="text-[#ff8c00] text-sm">Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <Users className="h-8 w-8 text-[#ff8c00] mx-auto mb-2" />
            <h3 className="text-[#2d3748] text-lg">24</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Shield className="h-8 w-8 text-[#ff8c00] mx-auto mb-2" />
            <h3 className="text-[#2d3748] text-lg">99.9%</h3>
            <p className="text-gray-600">System Uptime</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Settings className="h-8 w-8 text-[#ff8c00] mx-auto mb-2" />
            <h3 className="text-[#2d3748] text-lg">8</h3>
            <p className="text-gray-600">Active Sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}