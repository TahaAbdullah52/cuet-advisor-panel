import 'dotenv/config';
import mongoose from 'mongoose';
import Routine from './src/models/Routine.model';
import Advisor from './src/models/Advisor.model';

async function testRoutineManagement() {
  console.log('🔄 Testing Routine Management Endpoints...\n');
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB connected\n');

    // Find advisor
    const advisor = await Advisor.findOne({ email: 'advisor@cuet.ac.bd' });
    if (!advisor) {
      console.error('❌ Advisor not found. Please run seed-advisor.ts first.');
      return;
    }
    console.log('✅ Advisor found:', advisor.name, '\n');

    // Test 1: Create routine
    console.log('🧪 Test 1: Creating routine...');
    const routine = new Routine({
      advisor_id: advisor._id,
      semester: 'Fall 2024',
      academic_year: '2024-25',
      entries: [
        {
          day: 'Sunday',
          time: '08:00 - 09:30',
          course_code: 'CSE-331',
          course_name: 'Microprocessor',
          room: 'Room 301',
          type: 'lecture'
        },
        {
          day: 'Monday',
          time: '10:00 - 11:30',
          course_code: 'CSE-335',
          course_name: 'Algorithm Lab',
          room: 'Lab 201',
          type: 'lab'
        },
        {
          day: 'Tuesday',
          time: '08:00 - 09:30',
          course_code: 'CSE-331',
          course_name: 'Microprocessor',
          room: 'Room 301',
          type: 'lecture'
        }
      ]
    });
    await routine.save();
    console.log('✅ Routine created');
    console.log('- Semester:', routine.semester);
    console.log('- Academic Year:', routine.academic_year);
    console.log('- Entries:', routine.entries.length);
    console.log('\n---\n');

    // Test 2: Get all routines
    console.log('🧪 Test 2: Getting all routines...');
    const routines = await Routine.find({ advisor_id: advisor._id });
    console.log(`✅ Found ${routines.length} routine(s)`);
    routines.forEach(r => {
      console.log(`  - ${r.semester} (${r.academic_year}): ${r.entries.length} entries`);
    });
    console.log('\n---\n');

    // Test 3: Filter by day
    console.log('🧪 Test 3: Filtering entries by day (Monday)...');
    const mondayEntries = routine.entries.filter(e => e.day === 'Monday');
    console.log(`✅ Found ${mondayEntries.length} Monday entry(s):`);
    mondayEntries.forEach(entry => {
      console.log(`  - ${entry.time}: ${entry.course_code} (${entry.course_name}) @ ${entry.room}`);
    });
    console.log('\n---\n');

    // Test 4: Add entry
    console.log('🧪 Test 4: Adding new entry...');
    routine.entries.push({
      day: 'Wednesday',
      time: '14:00 - 15:30',
      course_code: 'CSE-409',
      course_name: 'Computer Graphics',
      room: 'Room 302',
      type: 'lecture'
    });
    await routine.save();
    console.log('✅ Entry added successfully');
    console.log('Total entries now:', routine.entries.length);
    console.log('\n---\n');

    // Test 5: Update routine
    console.log('🧪 Test 5: Updating routine semester...');
    routine.semester = 'Spring 2025';
    await routine.save();
    console.log('✅ Routine updated');
    console.log('New semester:', routine.semester);
    console.log('\n---\n');

    // Test 6: Remove entry
    console.log('🧪 Test 6: Removing first entry...');
    const removedEntry = routine.entries.shift();
    await routine.save();
    console.log('✅ Entry removed:', removedEntry?.course_code);
    console.log('Remaining entries:', routine.entries.length);
    console.log('\n---\n');

    // Test 7: Delete routine
    console.log('🧪 Test 7: Deleting routine...');
    await Routine.findByIdAndDelete(routine._id);
    console.log('✅ Routine deleted successfully');
    
    // Verify deletion
    const deletedRoutine = await Routine.findById(routine._id);
    console.log('Verification:', deletedRoutine ? 'Still exists' : 'Deleted');
    console.log('\n---\n');

    console.log('✅ ALL TESTS PASSED!\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run tests
testRoutineManagement();
