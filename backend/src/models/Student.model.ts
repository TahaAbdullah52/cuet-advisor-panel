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

// Thesis information interface
export interface IThesisInfo {
  topicAssigned: boolean;
  topicName?: string;
  defenseDate?: string;
  assignedTask?: string;
  meetingDateTime?: string;
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
  
  // Registration and graduation tracking
  next_semester_registration?: string;
  registration_status?: 'registered' | 'not_registered';
  graduation_status?: 'graduated' | 'active';
  
  // 8 terms with closed credit system
  L1T1: ITerm;
  L1T2: ITerm;
  L2T1: ITerm;
  L2T2: ITerm;
  L3T1: ITerm;
  L3T2: ITerm;
  L4T1: ITerm;
  L4T2: ITerm;
  
  // Thesis information (optional)
  thesisInfo?: IThesisInfo;
  
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

const ThesisInfoSchema = new Schema<IThesisInfo>(
  {
    topicAssigned: {
      type: Boolean,
      default: false
    },
    topicName: {
      type: String,
      trim: true
    },
    defenseDate: {
      type: String,
      trim: true
    },
    assignedTask: {
      type: String,
      trim: true
    },
    meetingDateTime: {
      type: String,
      trim: true
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
    
    // Registration and graduation tracking
    next_semester_registration: {
      type: String,
      trim: true
    },
    registration_status: {
      type: String,
      enum: ['registered', 'not_registered'],
      default: 'not_registered'
    },
    graduation_status: {
      type: String,
      enum: ['graduated', 'active'],
      default: 'active'
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
    },
    
    // Thesis information
    thesisInfo: {
      type: ThesisInfoSchema,
      default: undefined
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        // Transform L1T1-L4T2 properties to terms array for frontend
        const termKeys = ['L1T1', 'L1T2', 'L2T1', 'L2T2', 'L3T1', 'L3T2', 'L4T1', 'L4T2'];
        const terms = termKeys
          .filter(key => {
            const term = (ret as any)[key];
            return term && term.courses && term.courses.length > 0;
          })
          .map(key => {
            const term = (ret as any)[key];
            return {
              termId: key,
              approved: true,
              gpa: term.term_gpa || 0,
              courses: term.courses.map((course: any) => ({
                courseCode: course.code,
                courseCredit: course.credits,
                sessional: course.name?.includes('Sessional') || course.name?.includes('Lab') || false,
                result: course.grade || 'N/A',
                courseType: 'regular'
              })),
              resultPublished: true
            };
          });

        // Transform to frontend format
        return {
          studentId: ret.student_id,
          name: ret.name,
          email: ret.email,
          batch: ret.batch,
          terms: terms,
          overallCgpa: ret.cgpa || 0,
          nextSemesterRegistration: ret.next_semester_registration,
          registrationStatus: ret.registration_status || 'not_registered',
          approval_status: ret.approval_status,
          graduationStatus: ret.graduation_status || 'active',
          thesisInfo: ret.thesisInfo
        };
      }
    }
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
