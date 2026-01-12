# CUET Academic Advisor Panel

A comprehensive academic management system built for Chittagong University of Engineering & Technology (CUET) using Angular 21, Tailwind CSS, and Chart.js. This application provides advisors with tools to manage student registrations, track academic performance, supervise thesis work, and manage class routines.

##  Features

###  Dashboard
- **Real-time Statistics**: Total students, approval counts, pending registrations with automatic updates
- **Batch-wise Performance Charts**: Visual representation of academic performance trends
- **Detailed Batch Statistics**: Comprehensive table showing approved/pending counts per batch
- **Academic Performance Metrics**: Average CGPA, highest performing students

###  Student Management
- **Complete Student Profiles**: 8-semester academic records (L1T1 through L4T2)
- **Registration Status Tracking**: Registered vs Not Registered students
- **Advanced Approval System**: Individual and bulk approval with content type selection
- **Content Type Selection**: Choose between AI-generated or generic email content
- **Bulk Approval Operations**: "Approve All" button for efficient batch processing
- **ML-Powered Approval System**: AI-generated approval/disapproval content with database integration
- **Separate Action Buttons**: Dedicated "Approve" and "Disapprove" buttons for clear workflow
- **Batch-wise Organization**: Students organized by admission year (2019-2024)
- **Email Integration**: Automated email notifications to student Gmail accounts via database or simulation
- **Advanced Filtering**: Filter by batch, approval status, registration status
- **Database-First Architecture**: Primary database integration with hardcoded fallback

###  Thesis Supervision
- **Thesis Assignment Management**: Track thesis topics and assignments
- **Defense Scheduling**: Manage thesis defense dates and meetings
- **Student Progress Tracking**: Monitor thesis completion status
- **Task Assignment**: Assign and track thesis-related tasks
- **Meeting Coordination**: Schedule and manage advisor-student meetings

###  Routine Management
- **Persistent Data Storage**: Routines remain loaded across navigation with RoutineService
- **Class Schedule Overview**: View daily class and lab schedules
- **Real-time Current Class Indicator**: Highlights ongoing classes
- **Batch-wise Scheduling**: Organize classes by student batches
- **Add/Remove Functionality**: Dynamic routine management with database sync
- **Loading States**: Proper loading indicators and empty state handling

###  Authentication & Settings
- **Secure Login System**: Database-integrated authentication with fallback
- **Password Management**: Secure password updates with database sync
- **Profile Management**: Advisor profile and department information

##  Technology Stack

### Frontend Framework
- **Angular 21**: Latest Angular framework with standalone components
- **TypeScript**: Type-safe development with strict mode
- **RxJS**: Reactive programming for data management

### Styling & UI
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Custom Academic Theme**: Professional university portal design
- **Responsive Design**: Mobile-first responsive layout
- **Academic Color Palette**: Navy (#0f1b40), Dark Gray (#1e293b)

### Data Visualization
- **Chart.js 4.4**: Interactive charts and graphs
- **ng2-charts**: Angular wrapper for Chart.js
- **Custom Chart Components**: Reusable chart components

### Development Tools
- **Angular CLI 21**: Project scaffolding and build tools
- **PostCSS**: CSS processing and optimization
- **ESLint**: Code linting and quality assurance

##  Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 18.19.0 or higher
- **npm**: Version 10.2.3 or higher (comes with Node.js)
- **Angular CLI**: Version 21.0.5 or higher

```bash
# Check versions
node --version
npm --version
ng version
```

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cuet-advisor-panel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The application supports both database and mock data modes. Configure in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Your backend API URL
  useMockData: true, // Set to false when backend is available
  mockDataDelay: 800 // Simulated API delay in milliseconds
};
```

### 4. Start Development Server
```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

##  Architecture & Data Management

### Service Layer Architecture
The application follows a robust service-oriented architecture:

#### **Core Services**
- **StudentService**: Reactive student data management with BehaviorSubject
- **RoutineService**: Persistent routine data storage across navigation
- **ApiService**: Database-first API integration with automatic fallback

#### **Data Flow Pattern**
```
Component → Service → ApiService → Database (with Mock Fallback)
```

#### **Reactive Data Management**
- **BehaviorSubject**: Maintains persistent data across component navigation
- **Automatic Updates**: All subscribed components receive real-time updates
- **Memory Efficient**: Single data source, multiple subscribers

### Database-First Implementation
Every operation follows the database-first pattern:

1. **Primary**: Attempt database API call
2. **Fallback**: Use mock data if database unavailable
3. **Seamless**: Automatic switching based on environment configuration
4. **Consistent**: Same interface regardless of data source

### Batch Statistics Logic
Special handling for different student statuses:

#### **Graduated Students (Batch 19)**
- **Approved Count**: All graduated students automatically approved
- **Pending Count**: Always 0 (no approval needed)
- **Visual Indicator**: "Graduated" badge in dashboard

#### **Active Students (Batch 20-24)**
- **Approved Count**: Registered students with 'approved' status
- **Pending Count**: Registered students with 'pending' status
- **Filtering**: Only registered students counted in approval statistics

##  Configuration Options

### Database Integration
The application is designed with database-first architecture:

- **Primary**: Database API calls
- **Fallback**: Mock data when database unavailable
- **Seamless Switching**: Toggle between modes via environment configuration

### Mock Data Configuration
When `useMockData: true`, the application uses comprehensive mock data:

- **20 Students**: Distributed across batches 2019-2024
- **Realistic Academic Records**: Complete 8-semester data
- **Thesis Information**: Final year thesis assignments
- **Class Routines**: Weekly schedule data
- **Registration Status**: 80% registered, 20% not registered

### Authentication
Default login credentials (when database unavailable):
- **Email**: `advisor@cuet.ac.bd`
- **Password**: `pass12345`

##  Academic System Structure

### Semester Organization
The system follows CUET's 8-semester structure:
- **Level 1**: L1T1, L1T2 (Foundation courses)
- **Level 2**: L2T1, L2T2 (Core subjects)
- **Level 3**: L3T1, L3T2 (Advanced topics)
- **Level 4**: L4T1, L4T2 (Specialization & Thesis)

### Batch Progression (2024 Academic Year)
- **Batch 2019**: Graduated (All 8 semesters completed)
- **Batch 2020**: L4T2 (Final semester, thesis defense)
- **Batch 2021**: L3T2 (Advanced coursework)
- **Batch 2022**: L3T1 (Core specialization)
- **Batch 2023**: L2T2 (Intermediate level)
- **Batch 2024**: L2T1 (Foundation completion)

### Approval System Logic
- **Published Results**: Automatically approved (realistic academic workflow)
- **Next Semester Registration**: Requires advisor approval
- **ML-Generated Content**: Personalized approval/disapproval emails
- **Registration Status**: Only registered students can be approved/disapproved

##  ML-Powered Approval System

### Content Generation Options
The system provides two content generation modes:

#### 1. AI-Generated Content (Recommended)
- **Personalized Analysis**: Based on student's academic performance, GPA trends, and semester results
- **Performance Insights**: Detailed feedback on academic standing and improvement areas
- **Tailored Recommendations**: Specific advice based on individual student performance
- **Professional Tone**: Academic language appropriate for university communication

#### 2. Generic Content (Fast)
- **Standard Templates**: Quick, consistent messaging for all students
- **Time-Efficient**: Instant content generation without performance analysis
- **Uniform Communication**: Same message structure for all approvals/disapprovals
- **Professional Format**: Maintains academic standards with generic content

### Approval Workflows

#### Individual Student Approval
1. **Action Selection**: Click "Approve" or "Disapprove" button for registered student
2. **Content Type Choice**: Select between AI-generated or generic content
3. **Content Generation**: System generates personalized or generic email content
4. **Review & Edit**: Advisor can review and modify content before sending
5. **Email Dispatch**: Send to student's Gmail address with confirmation
6. **Status Update**: Student approval status updated in system

#### Bulk Approval Operations
1. **Approve All Button**: Visible when pending registered students exist
2. **Generic Content Only**: Bulk operations use standard template messages
3. **Batch Processing**: Sends emails to all pending students simultaneously
4. **Progress Tracking**: Shows email sending progress and completion status
5. **Confirmation**: Success notification with total count of emails sent

### Content Generation Logic
The system generates personalized approval/disapproval content based on:
- **Academic Performance**: Previous semester GPA and overall CGPA
- **Performance Trends**: Improvement or decline patterns
- **Academic Standing**: Excellent, satisfactory, or needs improvement
- **Specific Recommendations**: Tailored advice for each student

### Database Integration Priority
1. **Primary**: Database ML API for content generation and email sending
2. **Fallback**: Hardcoded AI-generated content with email simulation
3. **Seamless Switching**: Automatic fallback when database unavailable
4. **Error Handling**: Graceful degradation with user notifications

### User Interface Features
- **Content Type Selection Dialog**: Visual choice between AI and generic content
- **Real-time Content Switching**: Change content type and regenerate instantly
- **Email Preview**: Full email content preview with editing capabilities
- **Recipient Confirmation**: Shows specific student email address
- **Progress Indicators**: Loading states for content generation and email sending

### Approval Workflow
1. **Advisor Action**: Click dedicated "Approve" or "Disapprove" button for registered student
2. **Content Type Selection**: Choose between AI-generated (personalized) or generic (standard) content
3. **Content Generation**: System generates email content based on selected type and student performance
4. **Review Process**: Advisor reviews and can edit generated content in dialog
5. **Email Dispatch**: Send to student's specific Gmail address via database or simulation
6. **Status Update**: Student approval status updated in database or locally
7. **Confirmation**: Success notification with student's email address

### Bulk Operations
- **Approve All**: Processes all pending registered students with generic content
- **Email Batching**: Sends emails with staggered timing to avoid server overload
- **Progress Tracking**: Shows real-time progress of bulk email operations
- **Confirmation Summary**: Reports total number of successful email sends

### Sample Generated Content

#### AI-Generated Approval Example
```
Dear [Student Name],

Based on your excellent academic performance in L3T1 with a GPA of 3.75, 
I am pleased to approve your registration for the next semester.

Your consistent performance demonstrates strong academic capability and dedication. 
You have successfully completed all required courses with satisfactory grades.

Key Performance Highlights:
- Current Term GPA: 3.75
- Overall CGPA: 3.68
- Academic Standing: Excellent

You are hereby approved to register for L3T2. Please ensure you complete 
the registration process within the specified deadline.

Best regards,
Dr. Academic Advisor
Computer Science & Engineering Department
CUET
```

#### Generic Approval Example
```
Dear [Student Name],

Your registration for [Next Semester] has been approved by your advisor.

You may now proceed with the registration process within the specified deadline.

Best regards,
Academic Advisor
Computer Science & Engineering Department
CUET
```

##  Database Schema

### Students Table
```sql
CREATE TABLE students (
    student_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    batch VARCHAR(4) NOT NULL,
    overall_cgpa DECIMAL(3,2),
    next_semester_registration VARCHAR(10),
    registration_status ENUM('registered', 'not_registered'),
    approval_status ENUM('approved', 'disapproved', 'pending'),
    graduation_status ENUM('graduated', 'active'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Academic Terms Table
```sql
CREATE TABLE academic_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10),
    term_id VARCHAR(10) NOT NULL,
    gpa DECIMAL(3,2),
    approved BOOLEAN DEFAULT FALSE,
    result_published BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

### Thesis Information Table
```sql
CREATE TABLE thesis_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) UNIQUE,
    topic_assigned BOOLEAN DEFAULT FALSE,
    topic_name TEXT,
    defense_date DATE,
    assigned_task TEXT,
    meeting_datetime DATETIME,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

### Class Routines Table
```sql
CREATE TABLE routines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    batch VARCHAR(4) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    day_name VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_type ENUM('lecture', 'lab') DEFAULT 'lecture'
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Advisor login
- `PUT /api/auth/password` - Update password

### Student Management
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get specific student
- `PUT /api/students/:id` - Update student information
- `POST /api/students/approve` - Approve/disapprove student
- `POST /api/students/approve-multiple` - Bulk approve students

### ML Approval System
- `POST /api/students/generate-approval` - Generate ML content
- `POST /api/students/send-approval-email` - Send approval email

### Thesis Management
- `PUT /api/students/:id/thesis` - Update thesis information
- `POST /api/thesis/students` - Add student to thesis supervision
- `DELETE /api/thesis/students/:id` - Remove student from supervision

### Routine Management
- `GET /api/routines` - Get all routines
- `POST /api/routines` - Add new routine
- `DELETE /api/routines/:id` - Remove routine

##  UI/UX Design Principles

### Academic Professional Theme
- **Color Scheme**: Navy blue primary, muted grays, professional accents
- **Typography**: Clean, readable fonts suitable for academic environment
- **Layout**: Structured, organized, information-dense but not cluttered
- **Navigation**: Intuitive sidebar with clear section organization

### Responsive Design
- **Mobile-First**: Optimized for tablets and mobile devices
- **Flexible Layouts**: Adapts to different screen sizes
- **Touch-Friendly**: Appropriate button sizes and spacing

### Accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

##  Testing

### Unit Testing
```bash
ng test
```

### End-to-End Testing
```bash
ng e2e
```

### Linting
```bash
ng lint
```

##  Build & Deployment

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

### Build Optimization
- **Tree Shaking**: Removes unused code
- **Minification**: Compressed JavaScript and CSS
- **Lazy Loading**: Route-based code splitting
- **Service Worker**: Optional PWA support

##  Customization

### Adding New Features
1. **Create Component**: Use Angular CLI to generate components
2. **Update Routes**: Add routes in `app.routes.ts`
3. **Add Navigation**: Update sidebar in `layout/sidebar`
4. **Integrate API**: Add service methods in `core/api.service.ts`

### Styling Customization
- **Tailwind Config**: Modify `tailwind.config.js`
- **Custom CSS**: Add styles in `src/styles.css`
- **Component Styles**: Use Tailwind classes in templates

### Data Model Extension
- **Update Interfaces**: Modify `core/models.ts`
- **Update Mock Data**: Extend `core/mock-data.ts`
- **Update Services**: Add methods in service files

##  Troubleshooting

### Common Issues

#### Port Already in Use
```bash
ng serve --port 4201
```

#### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
ng build --verbose
```

#### Chart.js Issues
Ensure Chart.js is properly registered:
```typescript
import { provideChartjsConfig } from 'ng2-charts';
import { withDefaultRegisterables } from 'chart.js';

// In app.config.ts
provideChartjsConfig(withDefaultRegisterables())
```

#### Routine Data Not Persisting
If routines disappear when navigating between pages:
- Ensure RoutineService is properly injected
- Check that the service is using BehaviorSubject for data storage
- Verify API calls are going through the service layer

#### Dashboard Not Updating After Bulk Operations
If batch statistics don't update after "Approve All":
- Check that `studentService.refreshStudents()` is called after bulk operations
- Verify dashboard component is subscribed to `students$` observable
- Ensure proper reactive data flow through services

#### Graduated Batch Showing Pending Count
If Batch 19 shows pending count > 0:
- Verify graduation status logic in dashboard batch calculation
- Check that graduated students are properly handled in statistics
- Ensure mock data has correct graduation status for Batch 19

##  Development Guidelines

### Code Style
- **TypeScript Strict Mode**: Enabled for type safety
- **ESLint Rules**: Follow Angular style guide
- **Component Structure**: Use standalone components
- **Service Pattern**: Centralized data management

### Git Workflow
- **Feature Branches**: Create branches for new features
- **Commit Messages**: Use conventional commit format
- **Code Review**: Review before merging to main

### Performance Best Practices
- **OnPush Strategy**: Use for performance optimization
- **Lazy Loading**: Implement for large applications
- **Bundle Analysis**: Monitor bundle size
- **Memory Management**: Proper subscription cleanup

##  Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-feature`
3. **Commit Changes**: `git commit -m 'Add new feature'`
4. **Push to Branch**: `git push origin feature/new-feature`
5. **Create Pull Request**

##  Version History

##  Recent Improvements & Fixes

### v1.0.1 - Latest Updates

#### **Enhanced Dashboard Analytics**
- **Fixed Batch Statistics**: Graduated batches (Batch 19) now correctly show 0 pending count
- **Real-time Updates**: Dashboard automatically refreshes after bulk approval operations
- **Visual Improvements**: Added "Graduated" badges and better color coding
- **Accurate Counting**: Proper distinction between approved/pending/graduated students

#### **Routine Management Overhaul**
- **Persistent Data**: Created RoutineService for data persistence across navigation
- **No More Empty States**: Routines remain loaded when switching between pages
- **Loading States**: Added proper loading indicators and empty state handling
- **Database Sync**: Full database integration with mock data fallback

#### **Performance & UX Improvements**
- **Reactive Updates**: All components now use BehaviorSubject for real-time data sync
- **Bulk Operations**: Improved bulk approval with proper database synchronization
- **Filter Enhancements**: "Registered" filter now shows all registered students regardless of approval status
- **Content Type Selection**: Enhanced UI for choosing between AI-generated and generic email content

#### **Technical Fixes**
- **Database-First**: Every operation now properly tries database first, then falls back to mock data
- **Service Layer**: Consistent service pattern across all modules (Students, Routines, Thesis)
- **Error Handling**: Improved error handling with graceful degradation
- **Memory Management**: Proper subscription cleanup and reactive data management

### v1.0.0 (Current)
-  Complete student management system with reactive data management
-  Advanced approval system with content type selection (AI vs Generic)
-  Bulk approval operations with "Approve All" functionality and proper data sync
-  ML-powered approval system with database integration and hardcoded fallback
-  Separate Approve/Disapprove buttons for clear workflow
-  Email integration with student-specific addresses
-  Content switching and real-time regeneration
-  Thesis supervision module with database integration
-  Routine management with persistent data storage (RoutineService)
-  Dashboard with real-time analytics and batch statistics
-  Graduated batch handling (Batch 19 always shows 0 pending)
-  Database-first architecture with seamless fallback
-  Responsive design with loading states and empty state handling
-  Authentication system with secure password management
-  Comprehensive filtering system (registered students, approval status)
-  Reactive data updates across all components

---
