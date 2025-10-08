import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { clearAdminSession } from './AdminLogin';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  CreditCard, 
  Heart,
  BarChart3,
  Settings,
  Wrench,
  Microchip,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import Image from "next/image";

interface AdminPanelProps {
  onBack: () => void;
}

type AdminSection = 'overview' | 'users' | 'payments' | 'donations' | 'inventory' | 'reports' | 'settings';

interface User {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  membershipLevel: 'basic' | 'premium' | 'lifetime';
  joinDate: string;
  isActive: boolean;
}

interface Payment {
  _id: string;
  payment_id: string;
  userId: string;
  service: string;
  totalCost: number;
  paymentMethod: string;
  timestamp: string;
}

interface Donation {
  _id: string;
  donation_id: string;
  donorName: string;
  donationType: 'monetary' | 'items';
  amount?: number;
  items?: Array<{ name: string; quantity: number; value: number }>;
  timestamp: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  type: 'tool' | 'component';
  category: string;
  price: number;
  stock: number;
  available: boolean;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalDonations: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentTransactions: 0
  });

  const adminSections = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'bg-blue-600' },
    { id: 'users', label: 'User Management', icon: Users, color: 'bg-green-600' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'bg-purple-600' },
    { id: 'donations', label: 'Donations', icon: Heart, color: 'bg-red-600' },
    { id: 'inventory', label: 'Inventory', icon: Wrench, color: 'bg-yellow-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'bg-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-600' }
  ];

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load different data based on active section
      if (activeSection === 'overview' || activeSection === 'users') {
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        }
      }

      if (activeSection === 'overview' || activeSection === 'payments') {
        const paymentsRes = await fetch('/api/admin/payments');
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.payments || []);
        }
      }

      if (activeSection === 'overview' || activeSection === 'donations') {
        const donationsRes = await fetch('/api/admin/donations');
        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(Array.isArray(donationsData) ? donationsData : donationsData.donations || []);
        }
      }

      if (activeSection === 'inventory') {
        const inventoryRes = await fetch('/api/admin/inventory');
        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          setInventory(Array.isArray(inventoryData) ? inventoryData : inventoryData.items || []);
        }
      }

      // Calculate stats
      calculateStats();
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.totalCost, 0);
    const totalDonationAmount = donations
      .filter(d => d.donationType === 'monetary')
      .reduce((sum, donation) => sum + (donation.amount || 0), 0);
    
    setStats({
      totalUsers: users.length,
      totalPayments: payments.length,
      totalDonations: donations.length,
      totalRevenue: totalRevenue,
      activeUsers: users.filter(u => u.isActive).length,
      recentTransactions: payments.filter(p => 
        new Date(p.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    });
  };

  const handleLogout = () => {
    clearAdminSession();
    onBack(); // Return to dashboard after logout
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₱0';
    }
    return `₱${amount.toLocaleString()}`;
  };
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-green-400 text-xs">{stats.activeUsers} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-green-400 text-xs">{stats.totalPayments} transactions</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Donations</p>
                <p className="text-2xl font-bold text-white">{stats.totalDonations}</p>
                <p className="text-purple-400 text-xs">Community support</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Recent Activity</p>
                <p className="text-2xl font-bold text-white">{stats.recentTransactions}</p>
                <p className="text-blue-400 text-xs">Last 7 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1a202c] border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {Array.isArray(payments) && payments.length > 0 ? (
              payments.slice(0, 5).map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-3 bg-[#2d3748] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-[#ff8c00]" />
                    <div>
                      <p className="text-white font-medium">{payment.service || 'Unknown Service'}</p>
                      <p className="text-gray-400 text-sm">{formatDate(payment.timestamp)}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-semibold">{formatCurrency(payment.totalCost)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-[#1a202c] border-gray-600">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-[#2d3748] rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#ff8c00] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {user.membershipLevel} • Joined {formatDate(user.joinDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Payment Management</h2>
        <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card className="bg-[#1a202c] border-gray-600">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.isArray(payments) && payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-4 bg-[#2d3748] rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8 text-[#ff8c00]" />
                    <div>
                      <p className="text-white font-medium">{payment.service || 'Unknown Service'}</p>
                      <p className="text-gray-400 text-sm">Payment ID: {payment.payment_id || 'N/A'}</p>
                      <p className="text-xs text-gray-500">
                        {payment.paymentMethod || 'Unknown'} • {formatDate(payment.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{formatCurrency(payment.totalCost)}</p>
                    <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                      Completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No payments found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Donation Management</h2>
        <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card className="bg-[#1a202c] border-gray-600">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.isArray(donations) && donations.length > 0 ? (
              donations.map((donation) => (
                <div key={donation._id} className="flex items-center justify-between p-4 bg-[#2d3748] rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-white font-medium">{donation.donorName || 'Anonymous'}</p>
                      <p className="text-gray-400 text-sm">
                        {donation.donationType === 'monetary' ? 'Monetary Donation' : 'Item Donation'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(donation.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {donation.donationType === 'monetary' ? (
                      <p className="text-green-400 font-semibold">{formatCurrency(donation.amount || 0)}</p>
                    ) : (
                      <p className="text-blue-400 font-medium">{donation.items?.length || 0} items</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No donations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
        <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-[#ff8c00]" />
              Tools & Equipment
            </h3>
            <div className="space-y-3">
              {Array.isArray(inventory) && inventory.filter(item => item.type === 'tool').length > 0 ? (
                inventory.filter(item => item.type === 'tool').map((tool) => (
                  <div key={tool._id} className="flex items-center justify-between p-3 bg-[#2d3748] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{tool.name || 'Unknown Tool'}</p>
                      <p className="text-gray-400 text-sm">{tool.category || 'Uncategorized'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#ff8c00] font-semibold">{formatCurrency(tool.price)}/hr</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tool.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {tool.available ? 'Available' : 'In Use'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No tools found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Microchip className="h-5 w-5 mr-2 text-[#ff8c00]" />
              Electronic Components
            </h3>
            <div className="space-y-3">
              {Array.isArray(inventory) && inventory.filter(item => item.type === 'component').length > 0 ? (
                inventory.filter(item => item.type === 'component').map((component) => (
                  <div key={component._id} className="flex items-center justify-between p-3 bg-[#2d3748] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{component.name || 'Unknown Component'}</p>
                      <p className="text-gray-400 text-sm">{component.category || 'Uncategorized'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#ff8c00] font-semibold">{formatCurrency(component.price)}</p>
                      <p className="text-gray-400 text-sm">Stock: {component.stock || 0}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No components found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Usage Analytics</h3>
            <p className="text-gray-400 text-sm">Service usage patterns and trends</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Financial Report</h3>
            <p className="text-gray-400 text-sm">Revenue and payment analytics</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">User Report</h3>
            <p className="text-gray-400 text-sm">Member activity and engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <Wrench className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Equipment Report</h3>
            <p className="text-gray-400 text-sm">Tool usage and maintenance</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Donation Report</h3>
            <p className="text-gray-400 text-sm">Community contributions tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600 cursor-pointer hover:bg-[#2d3748] transition-colors">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Export Data</h3>
            <p className="text-gray-400 text-sm">Download reports in various formats</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Service Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">3D Printer Rate (₱/hour)</label>
                <Input defaultValue="5" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Soldering Station Rate (₱/hour)</label>
                <Input defaultValue="10" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Document Printing (₱/page)</label>
                <Input defaultValue="2" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a202c] border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Lab Contact Email</label>
                <Input defaultValue="admin@sorsogonlabs.gov.ph" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Maximum Session Duration (hours)</label>
                <Input defaultValue="8" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Currency Symbol</label>
                <Input defaultValue="₱" className="bg-[#2d3748] border-gray-600 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a202c] border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Database Management</h3>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              System Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 text-[#ff8c00] animate-spin" />
          <span className="ml-2 text-white">Loading...</span>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'payments': return renderPayments();
      case 'donations': return renderDonations();
      case 'inventory': return renderInventory();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#2d3748]">
      {/* Header */}
      <div className="bg-[#1a202c] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-[#ff8c00] text-xs">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-transparent border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-sm px-3 py-2"
              >
                <Shield className="h-4 w-4" />
                <span>Logout</span>
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center space-x-2 bg-transparent border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00] hover:text-white transition-colors text-sm px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <div className="bg-[#1a202c] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Administrator Dashboard</h2>
              <p className="text-gray-300">Comprehensive system management and analytics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {adminSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as AdminSection)}
                  className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    activeSection === section.id
                      ? 'bg-[#ff8c00] text-white shadow-lg'
                      : 'bg-[#2d3748] text-gray-300 hover:bg-[#4a5568]'
                  }`}
                >
                  <IconComponent className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#1a202c] rounded-xl p-6 shadow-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}