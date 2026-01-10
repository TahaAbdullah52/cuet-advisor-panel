export interface RoutineEntry {
  id?: string;
  courseName: string;
  batchName: string;
  roomNo: string;
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  type: 'Lab' | 'Class';
}

export interface TodaySchedule {
  upcoming: RoutineEntry[];
  completed: RoutineEntry[];
  current?: RoutineEntry;
}