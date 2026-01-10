# CUET Advisor Panel

A comprehensive academic advisor panel for Chittagong University of Engineering & Technology (CUET) built with Angular 21, designed to help faculty advisors manage students, thesis supervision, class routines, and academic workflows.

##   Features

###  Dashboard
- Real-time student statistics and analytics
- Batch-wise performance visualization with charts
- Approval status tracking and management
- Data source indicators (Database/Mock data)

###  Student Management
- Complete student database with search and filtering
- Approval workflow for semester registrations
- Individual student performance tracking
- Bulk approval functionality
- Email integration for student communications

###  Thesis Supervision
- Thesis topic assignment and tracking
- Defense scheduling and task management
- Meeting coordination with students
- Progress monitoring for final year students
- Add/remove students from thesis supervision

###  Class & Lab Routine
- Weekly schedule management
- Real-time current class indicators
- Upcoming and completed class tracking
- Room and batch assignment
- Add/remove routine entries

###  Settings & Security
- Password management with database integration
- Profile information display
- Account security features

###  Authentication
- Secure login with database integration
- Session management
- Fallback authentication system

##  Technology Stack

- **Frontend Framework**: Angular 21
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with ng2-charts
- **Icons**: Heroicons
- **HTTP Client**: Angular HttpClient
- **Reactive Programming**: RxJS
- **Build Tool**: Angular CLI with Vite
- **Package Manager**: npm

##  Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 18.19.0 or higher
- **npm**: Version 10.2.3 or higher
- **Angular CLI**: Version 21.0.5

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

### 3. Install Required Dependencies
```bash
# Core Angular dependencies (included in package.json)
npm install @angular/core@^21.0.0
npm install @angular/common@^21.0.0
npm install @angular/forms@^21.0.0
npm install @angular/router@^21.0.0
npm install @angular/platform-browser@^21.0.0

# Chart.js for data visualization
npm install chart.js ng2-charts

# Tailwind CSS for styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# RxJS for reactive programming
npm install rxjs@^7.8.0

# Development dependencies
npm install -D @angular/cli@^21.0.0
npm install -D typescript@~5.6.0
```

### 4. Configure Environment
```bash
# Copy environment template
cp src/environments/environment.ts.example src/environments/environment.ts

# Edit environment configuration
# Set useMockData: false when database is ready
# Update apiUrl to your backend URL
```

### 5. Run Development Server
```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

### 6. Build for Production
```bash
ng build --configuration production
```

##  Configuration

### Environment Settings
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Your backend API URL
  useMockData: true, // Set to false when backend is ready
  mockDataDelay: 50, // Simulate network delay in milliseconds
  features: {
    enableRefresh: true,
    showDataSource: true,
    enableBulkApproval: true
  }
};
```

### Database Integration
The application is designed to work with a REST API backend. When `useMockData: false`, it will attempt to connect to your database through the following endpoints:

#### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `PUT /api/auth/password` - Password update

#### Student Management Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get specific student
- `PUT /api/students/:id` - Update student information
- `POST /api/students/approve` - Approve student registration
- `POST /api/students/approve-multiple` - Bulk approve students

#### Thesis Management Endpoints
- `PUT /api/students/:id/thesis` - Update thesis information
- `POST /api/thesis/students` - Add student to thesis supervision
- `DELETE /api/thesis/students/:id` - Remove student from thesis

#### Routine Management Endpoints
- `GET /api/routines` - Get all routines
- `POST /api/routines` - Add new routine
- `DELETE /api/routines/:id` - Remove routine

##  Database Schema

### Students Table
```sql
CREATE TABLE students (
  student_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  batch VARCHAR(10) NOT NULL,
  overall_cgpa DECIMAL(3,2) DEFAULT 0.00,
  next_semester_registration VARCHAR(50),
  approval_status ENUM('approved', 'disapproved') DEFAULT 'disapproved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Thesis Information Table
```sql
CREATE TABLE thesis_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(20) NOT NULL,
  topic_assigned BOOLEAN DEFAULT FALSE,
  topic_name TEXT,
  defense_date DATE,
  assigned_task TEXT,
  meeting_datetime DATETIME,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

### Routines Table
```sql
CREATE TABLE routines (
  id VARCHAR(50) PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  batch_name VARCHAR(50) NOT NULL,
  room_no VARCHAR(50) NOT NULL,
  day_name ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type ENUM('Class','Lab') NOT NULL,
  advisor_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Advisor Credentials Table
```sql
CREATE TABLE advisor_credentials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  phone VARCHAR(20),
  office VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##  UI/UX Features

- **Academic Design**: Professional university portal appearance
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization
- **Loading States**: Proper loading indicators throughout the application
- **Error Handling**: Comprehensive error messages and fallback systems
- **Accessibility**: WCAG compliant design elements

##  Security Features

- Secure authentication with password hashing
- Session management with localStorage
- Input validation and sanitization
- CSRF protection ready
- Environment-based configuration


##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Acknowledgments

- Chittagong University of Engineering & Technology (CUET)
- Computer Science & Engineering Department
- Angular Team for the excellent framework
- Tailwind CSS for the utility-first CSS framework
- Chart.js for beautiful data visualizations

---
