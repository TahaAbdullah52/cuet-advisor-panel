import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutineEntry {
  day: string;
  time: string;
  course_code: string;
  course_name: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface IRoutine extends Document {
  _id: mongoose.Types.ObjectId;
  advisor_id: mongoose.Types.ObjectId;
  semester: string;
  academic_year: string;
  entries: IRoutineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const RoutineEntrySchema = new Schema<IRoutineEntry>(
  {
    day: {
      type: String,
      required: true,
      enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    time: {
      type: String,
      required: true,
      trim: true
    },
    course_code: {
      type: String,
      required: true,
      trim: true
    },
    course_name: {
      type: String,
      required: true,
      trim: true
    },
    room: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['lecture', 'lab', 'tutorial']
    }
  },
  { _id: false }
);

const RoutineSchema = new Schema<IRoutine>(
  {
    advisor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Advisor',
      required: [true, 'Advisor ID is required']
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      trim: true
    },
    academic_year: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true
    },
    entries: {
      type: [RoutineEntrySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
RoutineSchema.index({ advisor_id: 1 });
RoutineSchema.index({ advisor_id: 1, semester: 1, academic_year: 1 }); // Compound index

const Routine = mongoose.model<IRoutine>('Routine', RoutineSchema);

export default Routine;
