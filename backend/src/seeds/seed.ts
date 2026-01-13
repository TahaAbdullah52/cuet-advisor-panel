import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedAdvisors } from './advisorSeeder';
import { seedStudents } from './studentSeeder';
import { seedRoutines } from './routineSeeder';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cuet-advisor-panel';

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Seed advisors first
    console.log('📚 Seeding advisors...');
    const advisors = await seedAdvisors();
    const advisorIds = advisors.map(a => a._id);
    console.log('');

    // Seed students with advisor references
    console.log('👥 Seeding students...');
    await seedStudents(advisorIds);
    console.log('');

    // Seed routines with advisor references
    console.log('📅 Seeding routines...');
    await seedRoutines(advisorIds);
    console.log('');

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 3 Advisors created');
    console.log('   - 34 Students created across batches 19-24');
    console.log('   - Demo advisor (Dr. Saiful Islam) has 20 students');
    console.log('   - 3 Routines created for Fall 2025');
    console.log('\n🔐 Login Credentials:');
    console.log('   Email: saiful@cuet.ac.bd | rifat@cuet.ac.bd | mahbub@cuet.ac.bd');
    console.log('   Password: pass12345 (for all advisors)');
    console.log('\n📧 Demo Students (Pending Approval - Dr. Saiful Islam):');
    console.log('   - u2104040@student.cuet.ac.bd (Junain Uddin)');
    console.log('   - u2104051@student.cuet.ac.bd (Fahim Ahmed)');
    console.log('   - u2104048@student.cuet.ac.bd (Tasnim Akter)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

runSeeders();
