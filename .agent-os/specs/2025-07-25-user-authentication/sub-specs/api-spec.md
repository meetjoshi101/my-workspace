# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-07-25-user-authentication/spec.md

> Created: 2025-07-25
> Version: 1.0.0

## Endpoints

### POST /api/auth/register

**Purpose:** Register a new user account
**Parameters:**
- email (string, required): Valid email address
- password (string, required): Password meeting strength requirements
- confirmPassword (string, required): Must match password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": 123
}
```

**Errors:**
- 400: Validation errors (invalid email, weak password, passwords don't match)
- 409: Email already registered
- 500: Server error during registration

### POST /api/auth/login

**Purpose:** Authenticate user and return JWT token
**Parameters:**
- email (string, required): Registered email address
- password (string, required): User's password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

**Note:** JWT token is set as httpOnly cookie, not returned in response body

**Errors:**
- 400: Missing credentials
- 401: Invalid email or password
- 403: Email not verified
- 500: Server error during authentication

### POST /api/auth/logout

**Purpose:** Logout user and invalidate session
**Parameters:** None required
**Authorization:** Requires valid JWT token

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Errors:**
- 401: No valid session to logout
- 500: Server error during logout

### GET /api/auth/verify-email/:token

**Purpose:** Verify user email address using token from email
**Parameters:**
- token (string, URL parameter): Verification token from email

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Errors:**
- 400: Invalid or expired token
- 404: Token not found
- 500: Server error during verification

### GET /api/auth/me

**Purpose:** Get current authenticated user information
**Parameters:** None
**Authorization:** Requires valid JWT token

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "emailVerified": true,
    "createdAt": "2025-07-25T10:00:00Z"
  }
}
```

**Errors:**
- 401: No valid authentication token
- 500: Server error

## Controllers

### AuthController

**registerUser**
- Validates input data using Joi schema
- Checks if email already exists
- Hashes password using bcrypt
- Creates user record in database
- Generates email verification token
- Sends verification email
- Returns success response

**loginUser**
- Validates credentials
- Retrieves user from database by email
- Compares password hash using bcrypt
- Checks if email is verified
- Generates JWT token
- Sets httpOnly cookie with token
- Returns user data

**logoutUser**
- Clears authentication cookie
- Returns success response

**verifyEmail**
- Validates token format
- Retrieves token from database
- Checks token expiration
- Updates user email_verified status
- Deletes used token
- Returns success response

**getCurrentUser**
- Extracts user ID from JWT token
- Retrieves user data from database
- Returns user information

## Middleware

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
}
```

## Route Protection

Protected routes will use the authentication middleware:

```javascript
// Example protected route
router.get('/api/projects', authenticateToken, projectController.getProjects);
```

## Error Response Format

All authentication endpoints follow consistent error format:

```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```
