# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-07-25-user-authentication/spec.md

> Created: 2025-07-25
> Version: 1.0.0

## Schema Changes

### New Tables

#### Users Table
Primary table for storing user account information.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Email Verification Tokens Table
Stores temporary tokens for email verification.

```sql
CREATE TABLE email_verification_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_expires_at ON email_verification_tokens(expires_at);
```

## Sequelize Models

### User Model

```javascript
// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  return User;
};
```

### Email Verification Token Model

```javascript
// models/EmailVerificationToken.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailVerificationToken = sequelize.define('EmailVerificationToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'email_verification_tokens',
    timestamps: false,
    underscored: true
  });

  return EmailVerificationToken;
};
```

## Model Associations

```javascript
// models/index.js associations
User.hasMany(EmailVerificationToken, { 
  foreignKey: 'user_id', 
  as: 'verificationTokens' 
});

EmailVerificationToken.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});
```

## Migration Strategy

1. **Initial Setup**: Create both tables in initial migration
2. **Indexes**: Add indexes for performance optimization
3. **Constraints**: Ensure foreign key constraints are properly set
4. **Data Integrity**: Add validation at database level where possible

## Performance Considerations

- **Email Index**: Unique index on email for fast user lookup during login
- **Token Index**: Unique index on verification tokens for quick validation
- **Cleanup Strategy**: Implement cleanup job for expired verification tokens
- **Connection Pooling**: Configure Sequelize connection pool for concurrent users

## Security Considerations

- **Password Storage**: Never store plain text passwords, only bcrypt hashes
- **Token Expiration**: Verification tokens expire after 24 hours
- **Cascade Deletion**: When user is deleted, all verification tokens are removed
- **SQL Injection**: Use parameterized queries through Sequelize ORM
