# Agricultural Engineers Registration System - API Documentation

## Base URL
\`\`\`
https://api.agricultural-engineers.com/v1
\`\`\`

## Authentication
All API endpoints require authentication using JWT tokens, except for public endpoints like registration and login.

### Headers
\`\`\`
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
\`\`\`

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "+966501234567"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user",
      "isActive": true,
      "emailVerified": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
\`\`\`

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
\`\`\`

### POST /auth/refresh
Refresh access token using refresh token.

### POST /auth/logout
Logout user and invalidate tokens.

### POST /auth/forgot-password
Send password reset email.

### POST /auth/reset-password
Reset password using reset token.

## User Management Endpoints

### GET /users/profile
Get current user profile.

### PUT /users/profile
Update current user profile.

### GET /users/{id}
Get user by ID (Admin/Registrar only).

### GET /users
Get all users with pagination and filters (Admin/Registrar only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `role`: Filter by role
- `isActive`: Filter by active status
- `search`: Search by name or email

## Application Management Endpoints

### GET /applications
Get applications with pagination and filters.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `userId`: Filter by user (Admin/Registrar only)
- `specializationId`: Filter by specialization
- `dateFrom`: Filter by date range
- `dateTo`: Filter by date range

### POST /applications
Create a new application.

**Request Body:**
\`\`\`json
{
  "specializationId": "uuid",
  "certificationLevelId": "uuid"
}
\`\`\`

### GET /applications/{id}
Get application by ID.

### PUT /applications/{id}
Update application (Owner/Admin/Registrar only).

### DELETE /applications/{id}
Delete application (Owner/Admin only).

### POST /applications/{id}/submit
Submit application for review.

### PUT /applications/{id}/status
Update application status (Reviewer/Registrar only).

**Request Body:**
\`\`\`json
{
  "status": "approved",
  "reason": "All requirements met",
  "userId": "reviewer_uuid"
}
\`\`\`

## Education Endpoints

### GET /applications/{applicationId}/education
Get education records for application.

### POST /applications/{applicationId}/education
Add education record.

**Request Body:**
\`\`\`json
{
  "degreeType": "bachelor",
  "degreeName": "Bachelor of Agricultural Engineering",
  "institutionName": "King Saud University",
  "institutionCountry": "Saudi Arabia",
  "fieldOfStudy": "Agricultural Engineering",
  "graduationYear": 2020,
  "graduationDate": "2020-06-15",
  "gpa": 3.8,
  "gpaScale": 4.0
}
\`\`\`

### PUT /education/{id}
Update education record.

### DELETE /education/{id}
Delete education record.

### POST /education/{id}/verify
Verify education record (Reviewer only).

## Work Experience Endpoints

### GET /applications/{applicationId}/experience
Get work experience records.

### POST /applications/{applicationId}/experience
Add work experience record.

### PUT /experience/{id}
Update work experience record.

### DELETE /experience/{id}
Delete work experience record.

### POST /experience/{id}/verify
Verify work experience record (Reviewer only).

## Training Endpoints

### GET /applications/{applicationId}/training
Get training records.

### POST /applications/{applicationId}/training
Add training record.

### PUT /training/{id}
Update training record.

### DELETE /training/{id}
Delete training record.

### POST /training/{id}/verify
Verify training record (Reviewer only).

## Document Management Endpoints

### GET /applications/{applicationId}/documents
Get documents for application.

### POST /applications/{applicationId}/documents
Upload document.

**Request:** Multipart form data
- `file`: Document file
- `documentType`: Type of document
- `documentName`: Display name
- `isRequired`: Whether document is required

### GET /documents/{id}
Get document by ID.

### DELETE /documents/{id}
Delete document.

### POST /documents/{id}/verify
Verify document (Reviewer only).

### GET /documents/{id}/download
Download document file.

## Professional Certifications Endpoints

### GET /applications/{applicationId}/certifications
Get professional certifications.

### POST /applications/{applicationId}/certifications
Add professional certification.

### PUT /certifications/{id}
Update professional certification.

### DELETE /certifications/{id}
Delete professional certification.

### POST /certifications/{id}/verify
Verify professional certification (Reviewer only).

## Verification Endpoints

### POST /verification/verify-item
Verify any item (education, experience, training, document, certification).

**Request Body:**
\`\`\`json
{
  "itemType": "education",
  "itemId": "uuid",
  "userId": "reviewer_uuid",
  "notes": "Verification notes"
}
\`\`\`

### GET /verification/history/{applicationId}
Get verification history for application.

## Institution Management Endpoints

### GET /institutions
Get institutions with pagination and filters.

### POST /institutions
Register new institution.

### GET /institutions/{id}
Get institution by ID.

### PUT /institutions/{id}
Update institution.

### PUT /institutions/{id}/status
Update institution status (Admin only).

## Fellowship Program Endpoints

### GET /fellowships
Get fellowship programs.

### POST /fellowships
Create fellowship program (Institution/Admin only).

### GET /fellowships/{id}
Get fellowship program by ID.

### PUT /fellowships/{id}
Update fellowship program.

### POST /fellowships/{id}/apply
Apply for fellowship program.

### GET /fellowships/{id}/applications
Get applications for fellowship program (Institution/Admin only).

## Notification Endpoints

### GET /notifications
Get user notifications.

### PUT /notifications/{id}/read
Mark notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

### DELETE /notifications/{id}
Delete notification.

## Reference Data Endpoints

### GET /countries
Get list of countries.

### GET /cities
Get list of cities (optionally filtered by country).

### GET /specializations
Get list of specializations.

### GET /certification-levels
Get list of certification levels.

## File Upload Endpoints

### POST /upload/document
Upload document file.

### POST /upload/image
Upload image file.

### DELETE /upload/{fileId}
Delete uploaded file.

## Reports Endpoints (Admin/Registrar only)

### GET /reports/applications
Get application statistics and reports.

### GET /reports/users
Get user statistics and reports.

### GET /reports/institutions
Get institution statistics and reports.

### POST /reports/export
Export data to various formats (CSV, Excel, PDF).

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
\`\`\`

## HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting

API requests are rate limited:
- Authenticated users: 1000 requests per hour
- Unauthenticated users: 100 requests per hour

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
\`\`\`json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
\`\`\`

## File Upload Specifications

### Supported File Types
- Documents: PDF, DOC, DOCX
- Images: JPG, JPEG, PNG
- Maximum file size: 10MB per file

### File Storage
Files are stored securely with unique identifiers and access controls.

## Security Considerations

1. All endpoints use HTTPS
2. JWT tokens expire after 24 hours
3. Refresh tokens expire after 30 days
4. File uploads are scanned for malware
5. Input validation and sanitization
6. SQL injection protection
7. XSS protection
8. CSRF protection
