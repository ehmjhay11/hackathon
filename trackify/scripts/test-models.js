import connectDB from '../lib/mongodb.js';
import Payment from '../models/Payment.js';
import Tool from '../models/Tool.js';

async function testModels() {
  try {
    console.log('🔄 Testing database models...');
    
    await connectDB();
    console.log('✅ Connected to database');

    // Test creating a sample tool
    console.log('\n📝 Testing Tool model...');
    const testTool = {
      tool_id: 'test_tool_001',
      name: 'Test Hammer',
      quantity: 10,
      amount: 25.99
    };

    const createdTool = await Tool.create(testTool);
    console.log('✅ Tool created:', createdTool.name);

    // Test fetching the tool
    const foundTool = await Tool.findOne({ tool_id: 'test_tool_001' });
    console.log('🔍 Tool found:', foundTool?.name);

    // Test creating a sample payment
    console.log('\n📝 Testing Payment model...');
    const testPayment = {
      payment_id: 'test_pay_001',
      name: 'Test Payment',
      date: new Date(),
      tools: 'Test Hammer',
      amount: 50.00
    };

    const createdPayment = await Payment.create(testPayment);
    console.log('✅ Payment created:', createdPayment.name);

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await Tool.deleteOne({ tool_id: 'test_tool_001' });
    await Payment.deleteOne({ payment_id: 'test_pay_001' });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All model tests passed!');
    
  } catch (error) {
    console.error('❌ Model test error:', error.message);
    
    // Try to cleanup on error
    try {
      await Tool.deleteOne({ tool_id: 'test_tool_001' });
      await Payment.deleteOne({ payment_id: 'test_pay_001' });
    } catch (cleanupError) {
      console.error('⚠️ Cleanup error:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

// Run the test
testModels();