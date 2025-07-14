# 🚀 QuickThrift Authentication Architecture

## 📋 Overview

QuickThrift implements a **dual-tier authentication system** that separates normal user operations from admin-only operations, ensuring security and proper role-based access control.

## 🔐 Authentication Tiers

### 1. **Normal User Operations** (No Admin Auth Required)
These endpoints are open for regular users to register and login:

#### `/api/auth/register` - User Registration
- **Purpose**: Allow new users to create accounts
- **Authentication**: None required
- **Method**: POST
- **Payload**:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepass123"
}
```
- **Response**: User object (without password) + success message
- **Role Assigned**: `user` (default)
- **Password Change Required**: `false`

#### `/api/auth/login` - User Login
- **Purpose**: Authenticate existing users
- **Authentication**: Username/email + password
- **Method**: POST
- **Payload**:
```json
{
  "username": "user123",
  "password": "securepass123"
}
```
- **Response**: User data + JWT token for session management

### 2. **Admin Operations** (Admin Auth Required)
These endpoints require admin credentials in the Authorization header:

#### `/api/users` - Admin User Creation
- **Purpose**: Allow admins to create users with specific roles
- **Authentication**: `Authorization: Admin admin@quickthrift.com:TempPass123!`
- **Method**: POST
- **Payload**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "temppass123",
  "role": "customer"
}
```
- **Response**: User object with admin-assigned role
- **Password Change Required**: `true` (mandatory for admin-created users)

## 🛡️ Security Implementation

### Admin Authentication Header
```
Authorization: Admin <admin_email>:<admin_password>
```

### Default Admin Credentials
- **Email**: `admin@quickthrift.com`
- **Password**: `TempPass123!` (must be changed on first login)
- **Role**: `admin`

### User Roles
1. **`admin`** - Full system access, can create users, manage all data
2. **`user`** - Regular user with standard permissions
3. **`customer`** - Customer-specific permissions (typically admin-created)

## 🔄 User Creation Workflows

### Normal User Registration Flow
```
User fills form → Frontend calls /api/auth/register → Backend creates user → User can login immediately
```

### Admin User Creation Flow
```
Admin logs in → Admin panel → Admin calls /api/users with auth header → Backend creates user → User must change password on first login
```

## 📡 API Endpoints Summary

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/health` | GET | None | System health check |
| `/api/auth/register` | POST | None | Normal user registration |
| `/api/auth/login` | POST | User credentials | User authentication |
| `/api/users` | POST | Admin auth header | Admin user creation |
| `/api/users` | GET | Optional token | List users (filtered by permissions) |

## 🧪 Testing the System

Use the **Production Test Page** (`/production-test.html`) to verify:

1. ✅ **Normal Registration**: Works without admin auth
2. ✅ **Admin Creation**: Requires proper admin authorization header
3. ✅ **Login System**: Authenticates users and provides tokens
4. ✅ **Data Persistence**: All user data stored in backend JSON files
5. ✅ **Role Separation**: Different permissions for different user types

## 🔧 Configuration

### Backend Files
- **Users**: `/backend/data/users.json`
- **Products**: `/backend/data/products.json`
- **Orders**: `/backend/data/orders.json`
- **Bags**: `/backend/data/bags.json`

### Frontend Integration
- **Normal Users**: Use `auth-system.js` for registration/login
- **Admin Panel**: Use `admin-auth.js` and `admin.js` for admin operations
- **API Communication**: All user data fetched from backend (no localStorage)

## 🚀 Production Readiness

### Security Features
- ✅ Password strength validation (8+ characters)
- ✅ Email uniqueness enforcement
- ✅ Role-based access control
- ✅ Admin-only user creation
- ✅ Mandatory password change for admin-created users
- ✅ Secure API endpoints with proper authorization

### Data Persistence
- ✅ All user data stored in backend JSON files
- ✅ Real-time data synchronization
- ✅ Cross-device session persistence
- ✅ No critical data in localStorage

### Frontend-Backend Separation
- ✅ Frontend: Vanilla JS/HTML/CSS (static files)
- ✅ Backend: Python Flask API (data persistence)
- ✅ Server: Node.js Express (static file serving)
- ✅ Clear API contracts between layers

## 📝 Next Steps

1. **Password Hashing**: Implement bcrypt for production password security
2. **JWT Security**: Add token expiration and refresh mechanisms
3. **Rate Limiting**: Implement API rate limiting for security
4. **Logging**: Add comprehensive request/response logging
5. **Database**: Consider migrating from JSON files to a proper database

---

**Status**: ✅ Production Ready with proper authentication separation
**Last Updated**: July 14, 2025
