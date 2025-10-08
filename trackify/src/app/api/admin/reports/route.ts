import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Import all models for comprehensive reporting
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const paymentSchema = new mongoose.Schema({}, { strict: false, collection: 'payments' });
const donationSchema = new mongoose.Schema({}, { strict: false, collection: 'donations' });
const toolSchema = new mongoose.Schema({}, { strict: false, collection: 'tools' });
const componentSchema = new mongoose.Schema({}, { strict: false, collection: 'components' });

const User = mongoose.models.AdminUser || mongoose.model('AdminUser', userSchema, 'users');
const Payment = mongoose.models.AdminPayment || mongoose.model('AdminPayment', paymentSchema, 'payments');
const Donation = mongoose.models.AdminDonation || mongoose.model('AdminDonation', donationSchema, 'donations');
const Tool = mongoose.models.AdminTool || mongoose.model('AdminTool', toolSchema, 'tools');
const Component = mongoose.models.AdminComponent || mongoose.model('AdminComponent', componentSchema, 'components');

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json';

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {
        timestamp: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) })
        }
      };
    }

    let reportData: any = {};

    switch (reportType) {
      case 'overview':
        reportData = await generateOverviewReport(dateFilter);
        break;
      case 'financial':
        reportData = await generateFinancialReport(dateFilter);
        break;
      case 'usage':
        reportData = await generateUsageReport(dateFilter);
        break;
      case 'users':
        reportData = await generateUserReport(dateFilter);
        break;
      case 'inventory':
        reportData = await generateInventoryReport();
        break;
      case 'donations':
        reportData = await generateDonationReport(dateFilter);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    // Add metadata
    reportData.metadata = {
      generatedAt: new Date().toISOString(),
      reportType,
      dateRange: {
        start: startDate,
        end: endDate
      },
      format
    };

    return NextResponse.json(reportData);

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function generateOverviewReport(dateFilter: any) {
  const [users, payments, donations, tools, components] = await Promise.all([
    User.find({}).countDocuments(),
    Payment.find(dateFilter),
    Donation.find(dateFilter),
    Tool.find({}).countDocuments(),
    Component.find({}).countDocuments()
  ]);

  const totalRevenue = payments.reduce((sum: number, p: any) => sum + (p.totalCost || 0), 0);
  const totalDonationValue = donations.reduce((sum: number, d: any) => {
    if (d.donationType === 'monetary') return sum + (d.amount || 0);
    if (d.items) return sum + d.items.reduce((itemSum: number, item: any) => itemSum + (item.value || 0), 0);
    return sum;
  }, 0);

  return {
    summary: {
      totalUsers: users,
      totalRevenue,
      totalDonationValue,
      totalTransactions: payments.length,
      totalDonations: donations.length,
      totalEquipment: tools + components
    },
    recentActivity: {
      payments: payments.slice(-10),
      donations: donations.slice(-5)
    }
  };
}

async function generateFinancialReport(dateFilter: any) {
  const payments = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$service',
        totalRevenue: { $sum: '$totalCost' },
        transactionCount: { $sum: 1 },
        averageTransaction: { $avg: '$totalCost' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  const monthlyRevenue = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        },
        revenue: { $sum: '$totalCost' },
        transactions: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const paymentMethods = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        total: { $sum: '$totalCost' }
      }
    }
  ]);

  return {
    serviceRevenue: payments,
    monthlyTrends: monthlyRevenue,
    paymentMethods,
    summary: {
      totalRevenue: payments.reduce((sum, p) => sum + p.totalRevenue, 0),
      totalTransactions: payments.reduce((sum, p) => sum + p.transactionCount, 0),
      averageTransaction: payments.reduce((sum, p) => sum + p.averageTransaction, 0) / payments.length || 0
    }
  };
}

async function generateUsageReport(dateFilter: any) {
  const serviceUsage = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$service',
        usageCount: { $sum: 1 },
        totalHours: { $sum: '$serviceDetails.hours' },
        totalCost: { $sum: '$totalCost' }
      }
    },
    { $sort: { usageCount: -1 } }
  ]);

  const dailyUsage = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        sessions: { $sum: 1 },
        revenue: { $sum: '$totalCost' }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);

  const peakHours = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { sessions: -1 } }
  ]);

  return {
    serviceUsage,
    dailyUsage,
    peakHours: peakHours.slice(0, 5),
    insights: {
      mostPopularService: serviceUsage[0]?._id || 'N/A',
      totalSessions: serviceUsage.reduce((sum, s) => sum + s.usageCount, 0),
      averageSessionValue: serviceUsage.reduce((sum, s) => sum + s.totalCost, 0) / serviceUsage.reduce((sum, s) => sum + s.usageCount, 1)
    }
  };
}

async function generateUserReport(dateFilter: any) {
  const users = await User.find({});
  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$membershipLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  const activeUsers = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$userId',
        sessions: { $sum: 1 },
        totalSpent: { $sum: '$totalCost' }
      }
    },
    { $sort: { sessions: -1 } },
    { $limit: 10 }
  ]);

  const newUsers = users.filter(user => {
    const joinDate = new Date(user.joinDate);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return joinDate > thirtyDaysAgo;
  });

  return {
    totalUsers: users.length,
    membershipBreakdown: userStats,
    activeUsers,
    newUsers: newUsers.length,
    userActivity: {
      totalSessions: activeUsers.reduce((sum, u) => sum + u.sessions, 0),
      averageSessionsPerUser: activeUsers.reduce((sum, u) => sum + u.sessions, 0) / activeUsers.length || 0
    }
  };
}

async function generateInventoryReport() {
  const [tools, components] = await Promise.all([
    Tool.find({}),
    Component.find({})
  ]);

  const toolStats = {
    total: tools.length,
    available: tools.filter(t => t.available).length,
    inMaintenance: tools.filter(t => t.condition === 'maintenance').length,
    categories: tools.reduce((acc: any, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {})
  };

  const componentStats = {
    total: components.length,
    inStock: components.filter(c => c.stock > 0).length,
    lowStock: components.filter(c => c.stock <= c.minStock).length,
    outOfStock: components.filter(c => c.stock === 0).length,
    totalValue: components.reduce((sum, c) => sum + (c.price * c.stock), 0)
  };

  const lowStockAlerts = components
    .filter(c => c.stock <= c.minStock)
    .map(c => ({
      name: c.name,
      currentStock: c.stock,
      minStock: c.minStock,
      price: c.price
    }));

  return {
    tools: toolStats,
    components: componentStats,
    alerts: {
      lowStock: lowStockAlerts,
      maintenanceRequired: tools.filter(t => t.condition === 'maintenance').map(t => ({
        name: t.name,
        category: t.category,
        lastMaintenance: t.lastMaintenance
      }))
    }
  };
}

async function generateDonationReport(dateFilter: any) {
  const donations = await Donation.find(dateFilter);
  
  const monetaryDonations = donations.filter(d => d.donationType === 'monetary');
  const itemDonations = donations.filter(d => d.donationType === 'items');

  const totalMonetaryValue = monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalItemValue = itemDonations.reduce((sum, d) => {
    return sum + (d.items?.reduce((itemSum: number, item: any) => itemSum + (item.value || 0), 0) || 0);
  }, 0);

  const monthlyDonations = await Donation.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          type: '$donationType'
        },
        count: { $sum: 1 },
        value: {
          $sum: {
            $cond: [
              { $eq: ['$donationType', 'monetary'] },
              '$amount',
              { $sum: '$items.value' }
            ]
          }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    summary: {
      totalDonations: donations.length,
      monetaryDonations: monetaryDonations.length,
      itemDonations: itemDonations.length,
      totalMonetaryValue,
      totalItemValue,
      totalValue: totalMonetaryValue + totalItemValue
    },
    monthlyTrends: monthlyDonations,
    topDonors: monetaryDonations
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, 10)
      .map(d => ({
        name: d.isAnonymous ? 'Anonymous' : d.donorName,
        amount: d.amount,
        date: d.timestamp
      })),
    recentDonations: donations.slice(-10)
  };
}