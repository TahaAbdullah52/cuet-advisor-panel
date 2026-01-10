import { RoutineEntry } from './routine.models';

export const MOCK_ROUTINE: RoutineEntry[] = [
  // Monday
  {
    id: '1',
    courseName: 'CSE-331 (Microprocessor)',
    batchName: 'Batch 21',
    roomNo: 'Room 301',
    dayName: 'Monday',
    startTime: '08:00',
    endTime: '09:30',
    type: 'Class'
  },
  {
    id: '2',
    courseName: 'CSE-333 (Database Lab)',
    batchName: 'Batch 21',
    roomNo: 'Lab 201',
    dayName: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    type: 'Lab'
  },

  // Tuesday
  {
    id: '4',
    courseName: 'CSE-335 (Algorithm Lab)',
    batchName: 'Batch 22',
    roomNo: 'Lab 301',
    dayName: 'Tuesday',
    startTime: '08:00',
    endTime: '10:00',
    type: 'Lab'
  },
  {
    id: '5',
    courseName: 'CSE-314 (Operating System)',
    batchName: 'Batch 21',
    roomNo: 'Room 401',
    dayName: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Class'
  },

  // Wednesday
  {
    id: '6',
    courseName: 'CSE-326 (Computer Networks Lab)',
    batchName: 'Batch 20',
    roomNo: 'Lab 101',
    dayName: 'Wednesday',
    startTime: '09:00',
    endTime: '11:00',
    type: 'Lab'
  },
  {
    id: '7',
    courseName: 'CSE-353 (Machine Learning)',
    batchName: 'Batch 20',
    roomNo: 'Room 501',
    dayName: 'Wednesday',
    startTime: '14:30',
    endTime: '16:00',
    type: 'Class'
  },

  // Thursday
  {
    id: '8',
    courseName: 'CSE-244 (Data Structure Lab)',
    batchName: 'Batch 22',
    roomNo: 'Lab 201',
    dayName: 'Thursday',
    startTime: '08:30',
    endTime: '10:30',
    type: 'Lab'
  },
  {
    id: '9',
    courseName: 'CSE-223 (Discrete Mathematics)',
    batchName: 'Batch 22',
    roomNo: 'Room 301',
    dayName: 'Thursday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Class'
  },
  // Sunday 
  {
    id: '10',
    courseName: 'CSE-100 (Basic Computer)',
    batchName: 'Batch 20',
    roomNo: 'Room 201',
    dayName: 'Sunday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Class'
  },
];