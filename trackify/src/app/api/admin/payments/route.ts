import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Payment schema for admin queries
const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  service: { type: String, required: true },
  totalCost: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  serviceDetails: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'payments' });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema, 'payments');

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const service = searchParams.get('service');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query filters
    const query: any = {};
    
    if (service && service !== 'all') {
      query.service = service;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get payments with pagination
    const payments = await Payment.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset);

    // Get total count for pagination
    const totalCount = await Payment.countDocuments(query);

    // Get aggregated statistics
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalCost' },
          totalTransactions: { $sum: 1 },
          averageTransaction: { $avg: '$totalCost' },
          serviceBreakdown: {
            $push: {
              service: '$service',
              amount: '$totalCost'
            }
          }
        }
      }
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: stats[0] || {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        serviceBreakdown: []
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}