# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-07-25-user-authentication/spec.md

> Created: 2025-07-25
> Version: 1.0.0

## Test Coverage

### Unit Tests

**User Model**
- Validates email format requirements
- Rejects duplicate email addresses
- Ensures password hash is never null
- Sets default email_verified to false
- Creates proper timestamps

**EmailVerificationToken Model**
- Generates unique tokens
- Associates correctly with user
- Validates expiration date requirements
- Handles cascade deletion when user is removed

**Authentication Service**
- Generates valid JWT tokens with correct payload
- Validates token signatures and expiration
- Handles token refresh logic
- Properly invalidates expired tokens

**Password Utilities**
- Hashes passwords with bcrypt correctly
- Validates password strength requirements
- Compares passwords against hashes accurately
- Rejects weak passwords (less than 8 chars, no special chars, etc.)

### Integration Tests

**User Registration Flow**
- Successfully creates user with valid data
- Sends verification email after registration
- Rejects registration with existing email
- Validates all required fields are present
- Returns appropriate error messages for invalid input

**User Login Flow**
- Authenticates user with correct credentials
- Rejects login with incorrect password
- Prevents login for unverified email addresses
- Sets authentication cookie on successful login
- Implements rate limiting for failed attempts

**Email Verification Flow**
- Verifies email with valid token
- Rejects expired verification tokens
- Handles already verified email addresses
- Cleans up used verification tokens

**Authentication Middleware**
- Protects routes requiring authentication
- Allows access with valid JWT token
- Blocks access without token
- Handles expired tokens gracefully
- Extracts user information from token

**Logout Flow**
- Clears authentication cookies
- Invalidates current session
- Allows access to public routes after logout

### Feature Tests (End-to-End)

**Complete Registration Workflow**
- User visits registration page
- Fills out registration form
- Receives verification email
- Clicks verification link
- Successfully logs in with new credentials

**Complete Login/Logout Workflow**
- User logs in with valid credentials
- Accesses protected dashboard
- Navigates to different authenticated pages
- Logs out successfully
- Cannot access protected pages after logout

**Error Handling Scenarios**
- Registration with invalid email format
- Registration with weak password
- Login with non-existent email
- Login with incorrect password
- Access protected route without authentication
- Use expired verification token

### Mocking Requirements

**Email Service**
- Mock nodemailer transporter for email sending tests
- Capture email content and recipients in test environment
- Simulate email delivery failures for error handling tests

**JWT Token Service**
- Mock token generation for consistent test results
- Simulate token expiration for timeout testing
- Mock token verification failures

**Database Interactions**
- Use test database or in-memory SQLite for isolation
- Mock Sequelize operations for unit tests
- Seed test data for consistent integration tests

**External Dependencies**
- Mock bcrypt operations for faster test execution
- Mock rate limiting middleware in test environment
- Mock environment variables for different test scenarios

## Test Data Setup

### User Test Data
```javascript
const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  },
  existingUser: {
    email: 'existing@example.com',
    password_hash: 'hashed_password',
    email_verified: true
  },
  unverifiedUser: {
    email: 'unverified@example.com',
    password_hash: 'hashed_password',
    email_verified: false
  }
};
```

### Token Test Data
```javascript
const testTokens = {
  validToken: 'valid_jwt_token_string',
  expiredToken: 'expired_jwt_token_string',
  invalidToken: 'invalid_token_format',
  verificationToken: 'email_verification_token'
};
```

## Test Environment Setup

- Use separate test database to avoid data conflicts
- Reset database state between test suites
- Configure test-specific environment variables
- Disable rate limiting in test environment
- Use deterministic token generation for reproducible tests
- Mock email sending to avoid actual email delivery
