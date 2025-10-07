import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// GET /api/test/db - Test database connection
export async function GET() {
  try {
    console.log('Testing database connection...');
    
    const connection = await connectDB();
    
    // Test database operations
    const dbInfo: any = {
      status: 'connected',
      database: connection.db?.databaseName || 'unknown',
      host: connection.host,
      port: connection.port,
      readyState: connection.readyState,
      timestamp: new Date().toISOString()
    };

    // Try to list collections
    try {
      if (connection.db) {
        const collections = await connection.db.listCollections().toArray();
        dbInfo.collections = collections.map(col => col.name);
        dbInfo.collectionsCount = collections.length;
      }
    } catch (error) {
      dbInfo.collectionsError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: dbInfo
    });

  } catch (error: unknown) {
    console.error('Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}