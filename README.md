# CUET Academic Advisor Panel

A comprehensive academic management system built for Chittagong University of Engineering & Technology (CUET) using Angular 21, Tailwind CSS, and Chart.js. This application provides advisors with tools to manage student registrations, track academic performance, supervise thesis work, and manage class routines.

## 🚀 Features

### 📊 Dashboard
- **Real-time Statistics**: Total students, approval counts, pending registrations
- **Batch-wise Performance Charts**: Visual representation of academic performance trends
- **Academic Performance Metrics**: Average CGPA, highest performing students
- **Data Source Indicators**: Shows whether using database or mock data

### 👥 Student Management
- **Complete Student Profiles**: 8-semester academic records (L1T1 through L4T2)
- **Registration Status Tracking**: Registered vs Not Registered students
- **ML-Powered Approval System**: AI-generated approval/disapproval content with database integration
- **Separate Action Buttons**: Dedicated "Approve" and "Disapprove" buttons for clear workflow
- **Batch-wise Organization**: Students organized by admission year (2019-2024)
- **Email Integration**: Automated email notifications to student Gmail accounts via database or simulation
- **Advanced Filtering**: Filter by batch, approval status, registration status
- **Database-First Architecture**: Primary database integration with hardcoded fallback

### 🎓 Thesis Supervision
- **Thesis Assignment Management**: Track thesis topics and assignments
- **Defense Scheduling**: Manage thesis defense dates and meetings
- **Student Progress Tracking**: Monitor thesis completion status
- **Task Assignment**: Assign and track thesis-related tasks
- **Meeting Coordination**: Schedule and manage advisor-student meetings

### 📅 Routine Management
- **Class Schedule Overview**: View daily class and lab schedules
- **Real-time Current Class Indicator**: Highlights ongoing classes
- **Batch-wise Scheduling**: Organize classes by student batches
- **Room Management**: Track classroom and lab assignments
- **Add/Remove Functionality**: Dynamic routine management

### 🔐 Authentication & Settings
- **Secure Login System**: Database-integrated authentication with fallback
- **Password Management**: Secure password updates with database sync
- **Profile Management**: Advisor profile and department information

## 🛠 Technology Stack

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

## 📋 Prerequisites

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

## 🚀 Installation & Setup

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

## 🔧 Configuration Options

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

## 📊 Academic System Structure

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

## 🤖 ML-Powered Approval System

### Content Generation
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

### User Interface
- **Separate Action Buttons**: Clear "Approve" and "Disapprove" buttons
- **No View Details**: Streamlined interface focused on approval workflow
- **Status-Based Display**: Buttons appear based on current approval status
- **Email Confirmation**: Shows specific student email address in success messages

### Approval Workflow
1. **Advisor Action**: Click dedicated "Approve" or "Disapprove" button for registered student
2. **Database Integration**: System attempts ML content generation via database API first
3. **Fallback System**: If database unavailable, uses hardcoded AI-generated content
4. **Content Generation**: AI generates personalized email content based on student performance
5. **Review Process**: Advisor reviews and can edit generated content in dialog
6. **Email Dispatch**: Send to student's specific Gmail address via database or simulation
7. **Status Update**: Student approval status updated in database or locally
8. **Confirmation**: Success notification with student's email address

### Sample Generated Content
```
Dear [Student Name],

Based on your excellent academic performance in L3T1 with a GPA of 3.75, 
I am pleased to approve your registration for the next semester.

Your consistent performance demonstrates strong academic capability and dedication...

Key Performance Highlights:
- Current Term GPA: 3.75
- Overall CGPA: 3.68
- Academic Standing: Excellent

You are hereby approved to register for L3T2...
```

## 🗄 Database Schema

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
    approval_status ENUM('approved', 'disapproved'),
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

## 🎨 UI/UX Design Principles

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

## 🧪 Testing

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

## 📦 Build & Deployment

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

## 🔧 Customization

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

## 🐛 Troubleshooting

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

## 📝 Development Guidelines

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

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-feature`
3. **Commit Changes**: `git commit -m 'Add new feature'`
4. **Push to Branch**: `git push origin feature/new-feature`
5. **Create Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- **Email**: support@cuet.ac.bd
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete student management system
- ✅ ML-powered approval system with database integration and hardcoded fallback
- ✅ Separate Approve/Disapprove buttons for clear workflow
- ✅ Email integration with student-specific addresses
- ✅ Thesis supervision module
- ✅ Routine management
- ✅ Dashboard with analytics
- ✅ Database-first architecture with seamless fallback
- ✅ Responsive design
- ✅ Authentication system
- ✅ Streamlined UI without view details buttons

### Upcoming Features
- 🔄 Advanced ML model training with historical data
- 🔄 Bulk email operations with template customization
- 🔄 Advanced reporting and analytics dashboard
- 🔄 Mobile application for advisors
- 🔄 Student portal integration
- 🔄 Automated reminder systems

---

**Built with ❤️ for CUET Academic Excellence**