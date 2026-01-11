// Central export file for all models
export { default as Advisor } from './Advisor.model';
export { default as Student } from './Student.model';
export { default as Routine } from './Routine.model';
export { default as ThesisInfo } from './ThesisInfo.model';

// Export interfaces
export type { IAdvisor } from './Advisor.model';
export type { IStudent, ICourse, ITerm } from './Student.model';
export type { IRoutine, IRoutineEntry } from './Routine.model';
export type { IThesisInfo } from './ThesisInfo.model';
