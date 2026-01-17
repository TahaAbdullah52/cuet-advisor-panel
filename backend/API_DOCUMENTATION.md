# CUET Academic Advisor Panel - API Documentation

## 🚀 Overview

This is the backend API for the CUET Academic Advisor Panel, featuring AI-powered email generation, student management, thesis supervision, and routine scheduling.

## 📚 Interactive API Documentation

Once the server is running, you can access the **interactive Swagger UI documentation** at:

```
http://localhost:3000/api-docs
```

### Features of Interactive Docs:
- ✅ **Try it out** - Test all endpoints directly in the browser
- ✅ **Authentication** - Add your JWT token to test protected routes
- ✅ **Request/Response examples** - See expected data formats
- ✅ **Schema definitions** - View all data models
- ✅ **Real-time testing** - No need for Postman or curl

## 🔑 Authentication

All endpoints (except `/api/auth/login`) require JWT authentication.

### How to authenticate:

1. **Login** to get your JWT token:
   ```bash
   POST http://localhost:3000/api/auth/login
   {
     "email": "advisor@cuet.ac.bd",
     "password": "advisor123"
   }
   ```

2. **Copy the token** from the response

3. **In Swagger UI**: Click the "Authorize" button (lock icon) at the top right

4. **Enter**: `Bearer <your-token-here>`

5. **Now you can test all protected endpoints!**

## 📋 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /login` - Login advisor (returns JWT token)
- `GET /profile` - Get advisor profile (protected)
- `PUT /password` - Update password (protected)

### Students (`/api/students`)
- `GET /` - Get all students
- `GET /:id` - Get student by ID
- `PUT /:id` - Update student information
- `PUT /:id/thesis` - Update student thesis
- `POST /approve-multiple` - Bulk approve students
- `POST /generate-approval` - **AI-powered email generation** (6-18s)
- `POST /send-approval-email` - Send email and update status

### Thesis (`/api/thesis`)
- `GET /students` - Get all thesis students (batch 20-21)
- `POST /students` - Assign thesis topic to student
- `PUT /students/:id` - Update thesis information
- `DELETE /students/:id` - Remove student from thesis

### Routine (`/api/routines`)
- `GET /` - Get all routine entries
- `GET /:id` - Get routine by ID
- `POST /` - Create new routine entry
- `PUT /:id` - Update routine entry
- `DELETE /:id` - Delete routine entry
- `POST /:id/entries` - Add routine entry
- `DELETE /:id/entries/:entryIndex` - Remove entry by index

## 🤖 AI-Powered Features

### Email Generation (`/api/students/generate-approval`)

This endpoint uses **Ollama (local AI)** or **Google Gemini** to generate personalized approval/disapproval emails based on:
- Student's academic performance
- Latest semester GPA
- Overall CGPA
- Historical performance trends

**Processing time**: 6-18 seconds depending on AI model

**Example Request**:
```json
{
  "studentId": "2104040",
  "currentStatus": "pending",
  "newStatus": "approved"
}
```

**Example Response**:
```json
{
  "success": true,
  "generatedContent": "Dear John Doe,\n\nBased on your excellent academic performance in L3T2 with a GPA of 3.85...",
  "message": "Content generated successfully"
}
```

## 🛠️ Quick Start

### 1. Start the Server
```bash
cd backend
npm run dev
```

Server runs on: `http://localhost:3000`

### 2. Access Documentation
Open browser: `http://localhost:3000/api-docs`

### 3. Test Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "success",
  "message": "CUET Advisor Panel API is running",
  "timestamp": "2026-01-13T10:30:00.000Z",
  "documentation": "/api-docs"
}
```

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

## 🔐 Security

- **JWT Authentication**: All protected routes require valid JWT token
- **Password Hashing**: bcrypt with salt rounds
- **CORS Enabled**: Frontend can access API
- **Advisor-Student Isolation**: Advisors can only access their assigned students

## 🌟 Best Practices

### Using the API in Production

1. **Always include JWT token** in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

2. **Handle AI generation timeouts**: Email generation can take 6-18 seconds
   - Show loading state to user
   - Implement timeout handling (60s recommended)

3. **Batch operations**: Use `/approve-multiple` for bulk approvals instead of individual calls

4. **Error handling**: Check `success` field in response before processing data

## 📝 Example Workflows

### Workflow 1: Approve Student with AI Email

```javascript
// Step 1: Generate AI email
const generateResponse = await fetch('/api/students/generate-approval', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: '2104040',
    newStatus: 'approved'
  })
});

const { generatedContent } = await generateResponse.json();

// Step 2: Review and send email
const sendResponse = await fetch('/api/students/send-approval-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: '2104040',
    emailContent: generatedContent, // Can be edited by advisor
    newStatus: 'approved'
  })
});
```

### Workflow 2: Assign Thesis Topic

```javascript
const response = await fetch('/api/thesis/students', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    studentId: '2004040', // Batch 20-21
    thesis_topic: 'Machine Learning for Predictive Analytics',
    thesis_status: 'In Progress'
  })
});
```

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
**Solution**: Make sure you've included the JWT token in the Authorization header

### Issue: AI email generation timeout
**Solution**: 
- Check if Ollama is running: `ollama list`
- Verify OLLAMA_BASE_URL in .env
- Fallback to Gemini by setting AI_SERVICE=gemini

### Issue: "Student not found"
**Solution**: Verify the student belongs to your advisor account

## 📞 Support

For issues or questions:
- Check the interactive docs: http://localhost:3000/api-docs
- Review this documentation
- Check backend logs for detailed error messages

## 🎉 Happy Coding!

The interactive Swagger documentation is your best friend - use it to explore and test all endpoints!
