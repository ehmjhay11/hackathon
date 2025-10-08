import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Donation schema for admin queries
const donationSchema = new mongoose.Schema({
  donation_id: { type: String, required: true, unique: true },
  donorName: { type: String, required: true },
  donationType: { type: String, enum: ['monetary', 'items'], required: true },
  amount: { type: Number },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    value: { type: Number, required: true }
  }],
  message: { type: String },
  isAnonymous: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'donations' });

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema, 'donations');

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query filters
    const query: any = {};
    
    if (type && type !== 'all') {
      query.donationType = type;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get donations with pagination
    const donations = await Donation.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset);

    // Get total count for pagination
    const totalCount = await Donation.countDocuments(query);

    // Get aggregated statistics
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: '$donationType',
          count: { $sum: 1 },
          totalAmount: {
            $sum: {
              $cond: [
                { $eq: ['$donationType', 'monetary'] },
                '$amount',
                { $sum: '$items.value' }
              ]
            }
          }
        }
      }
    ]);

    // Calculate overall stats
    const overallStats = {
      totalDonations: totalCount,
      monetaryDonations: stats.find(s => s._id === 'monetary')?.count || 0,
      itemDonations: stats.find(s => s._id === 'items')?.count || 0,
      totalMonetaryValue: stats.find(s => s._id === 'monetary')?.totalAmount || 0,
      totalItemValue: stats.find(s => s._id === 'items')?.totalAmount || 0
    };

    return NextResponse.json({
      donations,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: overallStats
    });

  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const donationData = await request.json();
    
    // Create new donation
    const newDonation = new Donation(donationData);
    await newDonation.save();

    return NextResponse.json(newDonation, { status: 201 });

  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}