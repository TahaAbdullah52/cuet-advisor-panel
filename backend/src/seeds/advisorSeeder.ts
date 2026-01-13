import bcrypt from 'bcrypt';
import Advisor from '../models/Advisor.model';

export const seedAdvisors = async () => {
  try {
    // Clear existing advisors
    await Advisor.deleteMany({});
    console.log('Cleared existing advisors');

    const hashedPassword = await bcrypt.hash('pass12345', 10);

    const advisors = [
      {
        name: 'Dr. Saiful Islam',
        email: 'saiful@cuet.ac.bd',
        password: hashedPassword,
        phone: '+880 1711-123456',
        department: 'CSE',
        designation: 'Professor',
        office_room: 'CSE-401'
      },
      {
        name: 'Dr. Rifat Shahriyar',
        email: 'rifat@cuet.ac.bd',
        password: hashedPassword,
        phone: '+880 1711-234567',
        department: 'CSE',
        designation: 'Associate Professor',
        office_room: 'CSE-302'
      },
      {
        name: 'Dr. Mahbub Hasan',
        email: 'mahbub@cuet.ac.bd',
        password: hashedPassword,
        phone: '+880 1711-345678',
        department: 'CSE',
        designation: 'Assistant Professor',
        office_room: 'CSE-205'
      }
    ];

    const createdAdvisors = await Advisor.insertMany(advisors);
    console.log(`✅ Seeded ${createdAdvisors.length} advisors`);
    
    return createdAdvisors;
  } catch (error) {
    console.error('Error seeding advisors:', error);
    throw error;
  }
};
