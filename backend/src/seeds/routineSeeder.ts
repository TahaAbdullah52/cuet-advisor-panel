import Routine from '../models/Routine.model';
import { Types } from 'mongoose';

export const seedRoutines = async (advisorIds: Types.ObjectId[]) => {
  try {
    // Clear existing routines
    await Routine.deleteMany({});
    console.log('Cleared existing routines');

    const routines = [];

    // Routine 1: Fall 2025 - Dr. Saiful Islam (Batch 21)
    routines.push({
      advisor_id: advisorIds[0],
      semester: 'Fall',
      academic_year: '2025',
      entries: [
        // Sunday
        {
          day: 'Sunday',
          time: '08:30 - 10:00',
          course_code: 'CSE-311',
          course_name: 'Computer Networks',
          room: 'CSE-301',
          type: 'lecture'
        },
        {
          day: 'Sunday',
          time: '10:15 - 11:45',
          course_code: 'CSE-355',
          course_name: 'Software Engineering',
          room: 'CSE-302',
          type: 'lecture'
        },
        // Monday
        {
          day: 'Monday',
          time: '08:30 - 11:30',
          course_code: 'CSE-312',
          course_name: 'Computer Networks Lab',
          room: 'CSE-Lab-1',
          type: 'lab'
        },
        {
          day: 'Monday',
          time: '13:00 - 14:30',
          course_code: 'CSE-345',
          course_name: 'Artificial Intelligence',
          room: 'CSE-303',
          type: 'lecture'
        },
        // Tuesday
        {
          day: 'Tuesday',
          time: '10:15 - 11:45',
          course_code: 'CSE-321',
          course_name: 'Computer Architecture',
          room: 'CSE-301',
          type: 'lecture'
        },
        {
          day: 'Tuesday',
          time: '13:00 - 16:00',
          course_code: 'CSE-346',
          course_name: 'Artificial Intelligence Lab',
          room: 'CSE-Lab-2',
          type: 'lab'
        },
        // Wednesday
        {
          day: 'Wednesday',
          time: '08:30 - 10:00',
          course_code: 'CSE-347',
          course_name: 'Mathematical Programming',
          room: 'CSE-302',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          time: '10:15 - 11:45',
          course_code: 'CSE-302',
          course_name: 'Technical Writing',
          room: 'CSE-303',
          type: 'lecture'
        },
        // Thursday
        {
          day: 'Thursday',
          time: '08:30 - 11:30',
          course_code: 'CSE-356',
          course_name: 'Software Engineering Lab',
          room: 'CSE-Lab-1',
          type: 'lab'
        },
        {
          day: 'Thursday',
          time: '13:00 - 16:00',
          course_code: 'CSE-300',
          course_name: 'Software Development Project',
          room: 'CSE-Lab-2',
          type: 'lab'
        }
      ]
    });

    // Routine 2: Fall 2025 - Dr. Rifat Shahriyar (Batch 20)
    routines.push({
      advisor_id: advisorIds[1],
      semester: 'Fall',
      academic_year: '2025',
      entries: [
        // Sunday
        {
          day: 'Sunday',
          time: '10:15 - 11:45',
          course_code: 'CSE-431',
          course_name: 'Compiler Design',
          room: 'CSE-401',
          type: 'lecture'
        },
        {
          day: 'Sunday',
          time: '13:00 - 14:30',
          course_code: 'CSE-457',
          course_name: 'Computer Graphics',
          room: 'CSE-402',
          type: 'lecture'
        },
        // Monday
        {
          day: 'Monday',
          time: '10:15 - 11:45',
          course_code: 'Hum-445',
          course_name: 'Engineering Management',
          room: 'CSE-401',
          type: 'lecture'
        },
        {
          day: 'Monday',
          time: '13:00 - 16:00',
          course_code: 'CSE-432',
          course_name: 'Compiler Design Lab',
          room: 'CSE-Lab-3',
          type: 'lab'
        },
        // Tuesday
        {
          day: 'Tuesday',
          time: '08:30 - 10:00',
          course_code: 'Hum-447',
          course_name: 'Financial Accounting',
          room: 'CSE-402',
          type: 'lecture'
        },
        {
          day: 'Tuesday',
          time: '10:15 - 13:15',
          course_code: 'CSE-458',
          course_name: 'Computer Graphics Lab',
          room: 'CSE-Lab-3',
          type: 'lab'
        },
        // Wednesday
        {
          day: 'Wednesday',
          time: '10:15 - 11:45',
          course_code: 'CSE-Option-II',
          course_name: 'Advanced Database Systems',
          room: 'CSE-401',
          type: 'lecture'
        },
        {
          day: 'Wednesday',
          time: '13:00 - 16:00',
          course_code: 'CSE-400',
          course_name: 'Project & Thesis',
          room: 'CSE-Lab-3',
          type: 'lab'
        },
        // Thursday
        {
          day: 'Thursday',
          time: '10:15 - 13:15',
          course_code: 'CSE-400',
          course_name: 'Project & Thesis',
          room: 'CSE-Lab-3',
          type: 'lab'
        }
      ]
    });

    // Routine 3: Fall 2025 - Dr. Mahbub Hasan (Batch 22)
    routines.push({
      advisor_id: advisorIds[2],
      semester: 'Fall',
      academic_year: '2025',
      entries: [
        // Sunday
        {
          day: 'Sunday',
          time: '08:30 - 10:00',
          course_code: 'CSE-331',
          course_name: 'Microprocessors',
          room: 'CSE-201',
          type: 'lecture'
        },
        {
          day: 'Sunday',
          time: '10:15 - 11:45',
          course_code: 'CSE-333',
          course_name: 'Operating Systems',
          room: 'CSE-202',
          type: 'lecture'
        },
        // Monday
        {
          day: 'Monday',
          time: '08:30 - 10:00',
          course_code: 'CSE-313',
          course_name: 'Data Communication',
          room: 'CSE-201',
          type: 'lecture'
        },
        {
          day: 'Monday',
          time: '10:15 - 13:15',
          course_code: 'CSE-334',
          course_name: 'Operating Systems Lab',
          room: 'CSE-Lab-2',
          type: 'lab'
        },
        // Tuesday
        {
          day: 'Tuesday',
          time: '08:30 - 10:00',
          course_code: 'CSE-335',
          course_name: 'Database Management',
          room: 'CSE-201',
          type: 'lecture'
        },
        {
          day: 'Tuesday',
          time: '10:15 - 11:45',
          course_code: 'CSE-353',
          course_name: 'Numerical Methods',
          room: 'CSE-202',
          type: 'lecture'
        },
        {
          day: 'Tuesday',
          time: '13:00 - 16:00',
          course_code: 'CSE-336',
          course_name: 'Database Lab',
          room: 'CSE-Lab-2',
          type: 'lab'
        },
        // Wednesday
        {
          day: 'Wednesday',
          time: '10:15 - 13:15',
          course_code: 'CSE-314',
          course_name: 'Data Communication Lab',
          room: 'CSE-Lab-1',
          type: 'lab'
        },
        // Thursday
        {
          day: 'Thursday',
          time: '08:30 - 11:30',
          course_code: 'CSE-326',
          course_name: 'Microprocessors Lab',
          room: 'CSE-Lab-1',
          type: 'lab'
        },
        {
          day: 'Thursday',
          time: '13:00 - 16:00',
          course_code: 'CSE-354',
          course_name: 'Numerical Methods Lab',
          room: 'CSE-Lab-2',
          type: 'lab'
        }
      ]
    });

    const createdRoutines = await Routine.insertMany(routines);
    console.log(`✅ Seeded ${createdRoutines.length} routines`);
    console.log(`   - Dr. Saiful Islam: Batch 21 (L3T2) - 10 entries`);
    console.log(`   - Dr. Rifat Shahriyar: Batch 20 (L4T2) - 9 entries`);
    console.log(`   - Dr. Mahbub Hasan: Batch 22 (L3T1) - 10 entries`);
    
    return createdRoutines;
  } catch (error) {
    console.error('Error seeding routines:', error);
    throw error;
  }
};
