const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function migrateCollections() {
  try {
    console.log('🔄 Migrating collections to match schema...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    const db = mongoose.connection.db;

    // Get current collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Current collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Rename collections if they exist with plural names
    const migrations = [
      { from: 'payments', to: 'payment' },
      { from: 'donations', to: 'donation' },
      { from: 'purchases', to: 'purchase' },
      { from: 'users', to: 'user' },
      // tools stays as 'tools' according to schema
    ];

    console.log('\n🔄 Performing migrations...');
    
    for (const migration of migrations) {
      try {
        const sourceExists = collections.some(col => col.name === migration.from);
        const targetExists = collections.some(col => col.name === migration.to);
        
        if (sourceExists && !targetExists) {
          await db.collection(migration.from).rename(migration.to);
          console.log(`  ✅ Renamed: ${migration.from} → ${migration.to}`);
        } else if (sourceExists && targetExists) {
          console.log(`  ⚠️ Both ${migration.from} and ${migration.to} exist - manual merge needed`);
        } else if (!sourceExists) {
          console.log(`  ℹ️ Collection ${migration.from} doesn't exist - skipping`);
        }
      } catch (error) {
        console.log(`  ❌ Error migrating ${migration.from}:`, error.message);
      }
    }

    // List final collections
    const finalCollections = await db.listCollections().toArray();
    console.log('\n📋 Final collections:');
    finalCollections.forEach(col => console.log(`   - ${col.name}`));

    console.log('\n✅ Collection migration completed!');
    console.log('\n📝 Collection names now match schema:');
    console.log('   - payment (singular)');
    console.log('   - donation (singular)');
    console.log('   - purchase (singular)');
    console.log('   - tools (plural as shown in schema)');
    console.log('   - user (singular)');

    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateCollections();