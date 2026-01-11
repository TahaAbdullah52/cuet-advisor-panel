import mongoose, { Document, Schema } from 'mongoose';

// Course interface for embedded courses
export interface ICourse {
  code: string;
  name: string;
  credits: number;
  grade?: string;
  gpa?: number;
}

// Term interface for 8 terms (L1T1 to L4T2)
export interface ITerm {
  courses: ICourse[];
  term_gpa?: number;
  term_credits?: number;
}

export interface IStudent extends Document {
  _id: mongoose.Types.ObjectId;
  student_id: string;
  name: string;
  email: string;
  registration_number: string;
  department: string;
  batch: string;
  session: string;
  phone: string;
  cgpa?: number;
  total_credits?: number;
  advisor_id: mongoose.Types.ObjectId;
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_date?: Date;
  approval_note?: string;
  
  // 8 terms with closed credit system
  L1T1: ITerm;
  L1T2: ITerm;
  L2T1: ITerm;
  L2T2: ITerm;
  L3T1: ITerm;
  L3T2: ITerm;
  L4T1: ITerm;
  L4T2: ITerm;
  
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    credits: {
      type: Number,
      required: true,
      min: 0
    },
    grade: {
      type: String,
      trim: true,
      uppercase: true
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4
    }
  },
  { _id: false }
);

const TermSchema = new Schema<ITerm>(
  {
    courses: {
      type: [CourseSchema],
      default: []
    },
    term_gpa: {
      type: Number,
      min: 0,
      max: 4
    },
    term_credits: {
      type: Number,
      min: 0
    }
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    student_id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    registration_number: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      trim: true
    },
    session: {
      type: String,
      required: [true, 'Session is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4
    },
    total_credits: {
      type: Number,
      min: 0
    },
    advisor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Advisor',
      required: [true, 'Advisor ID is required']
    },
    approval_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approval_date: {
      type: Date
    },
    approval_note: {
      type: String,
      trim: true
    },
    
    // 8 Terms
    L1T1: {
      type: TermSchema,
      default: { courses: [] }
    },
    L1T2: {
      type: TermSchema,
      default: { courses: [] }
    },
    L2T1: {
      type: TermSchema,
      default: { courses: [] }
    },
    L2T2: {
      type: TermSchema,
      default: { courses: [] }
    },
    L3T1: {
      type: TermSchema,
      default: { courses: [] }
    },
    L3T2: {
      type: TermSchema,
      default: { courses: [] }
    },
    L4T1: {
      type: TermSchema,
      default: { courses: [] }
    },
    L4T2: {
      type: TermSchema,
      default: { courses: [] }
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
StudentSchema.index({ student_id: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ registration_number: 1 });
StudentSchema.index({ advisor_id: 1 });
StudentSchema.index({ approval_status: 1 });
StudentSchema.index({ advisor_id: 1, approval_status: 1 }); // Compound index for common query

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
