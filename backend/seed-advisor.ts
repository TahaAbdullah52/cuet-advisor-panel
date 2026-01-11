import 'dotenv/config';
import mongoose from 'mongoose';
import Advisor from './src/models/Advisor.model';

async function seedAdvisor() {
  console.log('🌱 Seeding test advisor...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB connected\n');

    // Check if advisor already exists
    const existing = await Advisor.findOne({ email: 'advisor@cuet.ac.bd' });
    
    if (existing) {
      console.log('ℹ️  Advisor already exists');
      console.log('Name:', existing.name);
      console.log('Email:', existing.email);
      return;
    }

    // Create advisor
    const advisor = new Advisor({
      name: 'Dr. Academic Advisor',
      email: 'advisor@cuet.ac.bd',
      password: 'pass12345',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      phone: '01712345678',
      office_room: 'Room 301, CSE Building'
    });

    await advisor.save();
    
    console.log('✅ Test advisor created successfully!');
    console.log('Name:', advisor.name);
    console.log('Email:', advisor.email);
    console.log('Department:', advisor.department);
    console.log('\nUse these credentials to login:');
    console.log('Email: advisor@cuet.ac.bd');
    console.log('Password: pass12345');

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

seedAdvisor();
