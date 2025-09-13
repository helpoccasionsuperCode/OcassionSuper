
## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/occasionsuper
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB** (local or use MongoDB Atlas)

6. **Run the application**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Authentication & Vendor Profile APIs

### Quick Start Guide

The backend now includes secure authentication and vendor profile management. Here's how to use them:

#### 1. **Login to Get Access Token**
First, login to get a JWT token for authenticated requests.

#### 2. **Access Your Vendor Profile**
Use the token to view and update your vendor profile data.

### Environment Variables Required

Add these to your `.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
```

### Postman Quick Setup

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:3000` (or your server port)
   - `token`: (leave empty, will be set after login)

2. **Test Flow:**
   - First call Login API → copy token to environment
   - Then use token in Authorization header for profile APIs

---

## 🧪 Postman Testing

### Import Postman Collection

Download and import the Postman collection for easy API testing:

**Collection JSON:**
```json
{
  "info": {
    "name": "OccasionSuper Backend API",
    "description": "API collection for OccasionSuper vendor registration system",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Vendor Registration",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"businessName\": \"John's Catering\",\n  \"ownerName\": \"John Doe\",\n  \"email\": \"john@catering.com\",\n  \"phone\": \"1234567890\",\n  \"city\": \"New York\",\n  \"serviceArea\": \"Manhattan\",\n  \"categories\": [\"catering\", \"events\"],\n  \"packages\": [\"basic\", \"premium\"],\n  \"documents\": {\n    \"gst\": \"GST123456789\",\n    \"businessProof\": \"business_license.pdf\",\n    \"idProof\": \"aadhar_card.pdf\"\n  },\n  \"bankDetails\": {\n    \"accountHolder\": \"John Doe\",\n    \"accountNumber\": \"1234567890\",\n    \"ifsc\": \"ABCD0001234\"\n  }\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/register/vendor/register",
          "host": ["{{baseUrl}}"],
          "path": ["register", "vendor", "register"]
        }
      }
    }
  ]
}
```

### Environment Setup

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:5000`
   - `email`: `test@example.com` (for testing)

2. **Set Environment:**
   - Select "OccasionSuper Backend" environment in Postman

### Test Cases

## 🔑 Authentication APIs

### 1. **User Login**

**Purpose**: Get JWT token for authenticated requests

**Request:**
```http
POST {{baseUrl}}/api/login
Content-Type: application/json

{
  "email": "vendor@gmail.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789abc123",
      "email": "vendor@gmail.com",
      "role": "vendor",
      "vendor_id": "64a1b2c3d4e5f6789abc456"
    }
  }
}
```

**Postman Setup:**
1. Save the `token` from response to your environment variable
2. Use `{{token}}` in Authorization header for protected endpoints

---

## 👤 Vendor Profile APIs

### 2. **Get Vendor Profile**

**Purpose**: Fetch current vendor profile data from both User and VendorRegister tables

**Request:**
```http
GET {{baseUrl}}/api/vendor/64a1b2c3d4e5f6789abc123/profile
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile data fetched successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abc123",
      "email": "vendor@gmail.com",
      "role": "vendor",
      "phone_number": "9876543210",
      "is_active": true,
      "last_login": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "vendor": {
      "id": "64a1b2c3d4e5f6789abc456",
      "businessName": "John's Catering",
      "ownerName": "John Doe",
      "email": "vendor@gmail.com",
      "phone": "1234567890",
      "city": "New York",
      "serviceArea": "Manhattan",
      "categories": ["catering", "events"],
      "packages": [
        {
          "name": "Basic Package",
          "price": 5000,
          "description": "Basic catering service"
        }
      ],
      "documents": {
        "gst": ["gst_certificate.pdf"],
        "businessProof": ["business_license.pdf"],
        "idProof": ["aadhar_card.pdf"]
      },
      "bankDetails": {
        "accountHolder": "John Doe",
        "accountNumber": "1234567890",
        "ifsc": "ABCD0001234"
      },
      "status": "approved"
    }
  }
}
```

### 3. **Update Vendor Profile**

**Purpose**: Update profile data in both User and VendorRegister tables

**Request:**
```http
PUT {{baseUrl}}/api/vendor/64a1b2c3d4e5f6789abc123/profile
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "phone_number": "9876543210",
  "businessName": "Updated Business Name",
  "city": "Los Angeles",
  "serviceArea": "Downtown LA",
  "categories": ["photography", "catering"],
  "packages": [
    {
      "name": "Premium Package",
      "price": 10000,
      "description": "Premium service with photography"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abc123",
      "email": "vendor@gmail.com",
      "role": "vendor",
      "phone_number": "9876543210",
      "is_active": true,
      "vendor_id": "64a1b2c3d4e5f6789abc456",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    },
    "vendor": {
      "id": "64a1b2c3d4e5f6789abc456",
      "businessName": "Updated Business Name",
      "city": "Los Angeles",
      "serviceArea": "Downtown LA",
      "categories": ["photography", "catering"],
      "packages": [
        {
          "name": "Premium Package",
          "price": 10000,
          "description": "Premium service with photography"
        }
      ],
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

## 🚨 Error Responses

### Authentication Errors

**Missing Token:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Expired Token:**
```json
{
  "success": false,
  "message": "Token expired"
}
```

### Authorization Errors

**Access Denied (Wrong User):**
```json
{
  "success": false,
  "message": "Access denied. You can only access your own profile"
}
```

**Wrong Role:**
```json
{
  "success": false,
  "message": "Access denied. Vendor role required"
}
```

**Inactive Account:**
```json
{
  "success": false,
  "message": "Account is inactive"
}
```

---

## 📝 Original Vendor Registration (Still Available)

### 4. **Vendor Registration**

**Request:**
```http
POST {{baseUrl}}/register/vendor/register
Content-Type: application/json

{
  "businessName": "John's Catering",
  "ownerName": "John Doe",
  "email": "john@catering.com",
  "phone": "1234567890",
  "city": "New York",
  "serviceArea": "Manhattan",
  "categories": ["catering", "events"],
  "packages": ["basic", "premium"],
  "documents": {
    "gst": "GST123456789",
    "businessProof": "business_license.pdf",
    "idProof": "aadhar_card.pdf"
  },
  "bankDetails": {
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "ifsc": "ABCD0001234"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "data": {
    "userId": 1,
    "email": "john@catering.com",
    "businessName": "John's Catering",
    "status": "pending"
  }
}
```

#### 2. **Validation Error - Missing Required Fields**

**Request:**
```http
POST {{baseUrl}}/register/vendor/register
Content-Type: application/json

{
  "businessName": "Test Business",
  "email": "invalid-email"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "ownerName is required",
    "phone is required",
    "city is required",
    "serviceArea is required",
    "categories is required",
    "Email must be a valid email address"
  ]
}
```

#### 3. **Duplicate Email Error**

**Request:**
```http
POST {{baseUrl}}/register/vendor/register
Content-Type: application/json

{
  "businessName": "Another Business",
  "ownerName": "Jane Smith",
  "email": "john@catering.com",
  "phone": "9876543210",
  "city": "Los Angeles",
  "serviceArea": "Downtown",
  "categories": ["photography"]
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Vendor with this email already exists!"
}
```

#### 4. **Minimal Valid Request**

**Request:**
```http
POST {{baseUrl}}/register/vendor/register
Content-Type: application/json

{
  "businessName": "Simple Business",
  "ownerName": "Simple Owner",
  "email": "simple@business.com",
  "phone": "5555555555",
  "city": "Simple City",
  "serviceArea": "Simple Area",
  "categories": ["catering"]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "data": {
    "userId": 2,
    "email": "simple@business.com",
    "businessName": "Simple Business",
    "status": "pending"
  }
}
```

### Test Data Examples

#### **Catering Business**
```json
{
  "businessName": "Royal Catering Services",
  "ownerName": "Sarah Johnson",
  "email": "sarah@royalcatering.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "serviceArea": "South Mumbai",
  "categories": ["catering"],
  "packages": ["basic", "premium", "luxury"],
  "documents": {
    "gst": "GST987654321",
    "businessProof": "fssai_license.pdf",
    "idProof": "pan_card.pdf"
  },
  "bankDetails": {
    "accountHolder": "Royal Catering Services",
    "accountNumber": "9876543210",
    "ifsc": "HDFC0001234"
  }
}
```

#### **Photography Business**
```json
{
  "businessName": "Capture Moments Photography",
  "ownerName": "Mike Wilson",
  "email": "mike@capturemoments.com",
  "phone": "8765432109",
  "city": "Delhi",
  "serviceArea": "New Delhi",
  "categories": ["photography"],
  "packages": ["wedding", "corporate", "portrait"],
  "documents": {
    "gst": "GST876543210",
    "businessProof": "photography_license.pdf",
    "idProof": "passport.pdf"
  },
  "bankDetails": {
    "accountHolder": "Mike Wilson",
    "accountNumber": "8765432109",
    "ifsc": "ICIC0005678"
  }
}
```

#### **Decoration Business**
```json
{
  "businessName": "Elegant Decorations",
  "ownerName": "Priya Sharma",
  "email": "priya@elegantdecor.com",
  "phone": "7654321098",
  "city": "Bangalore",
  "serviceArea": "Whitefield",
  "categories": ["decoration"],
  "packages": ["basic", "premium", "custom"],
  "documents": {
    "gst": "GST765432109",
    "businessProof": "decoration_license.pdf",
    "idProof": "aadhar_card.pdf"
  },
  "bankDetails": {
    "accountHolder": "Priya Sharma",
    "accountNumber": "7654321098",
    "ifsc": "SBIN0009012"
  }
}
```

### Pre-request Scripts

Add this to your Postman request for dynamic data:

```javascript
// Generate unique email for testing
pm.environment.set("email", "test" + Date.now() + "@example.com");

// Set timestamp for unique business names
pm.environment.set("timestamp", Date.now());
```

### Tests Scripts

Add this to verify responses:

```javascript
// Test successful registration
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response has userId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.userId).to.be.a('number');
});

pm.test("Response has correct email", function () {
    var jsonData = pm.response.json();
    var requestData = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.data.email).to.eql(requestData.email.toLowerCase());
});
```

### Collection Variables

Set these in your Postman collection:

| Variable | Value | Description |
|----------|-------|-------------|
| `baseUrl` | `http://localhost:5000` | Base API URL |
| `email` | `test@example.com` | Test email |
| `businessName` | `Test Business` | Test business name |

## API Endpoints

### Vendor Registration

**POST** `/register/vendor/register`

Register a new vendor with business details.

#### Request Body
```json
{
  "businessName": "John's Catering",
  "ownerName": "John Doe",
  "email": "john@catering.com",
  "phone": "1234567890",
  "city": "New York",
  "serviceArea": "Manhattan",
  "categories": ["catering", "events"],
  "packages": ["basic", "premium"],
  "documents": {
    "gst": "GST123456789",
    "businessProof": "business_license.pdf",
    "idProof": "aadhar_card.pdf"
  },
  "bankDetails": {
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "ifsc": "ABCD0001234"
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Vendor registered successfully",
  "data": {
    "userId": 1,
    "email": "john@catering.com",
    "businessName": "John's Catering",
    "status": "pending"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email must be a valid email address",
    "Phone number format is invalid"
  ]
}
```

## 🏗️ Architecture Overview

### 1. **Validators** (`/validators/`)
- Pure validation logic using Joi
- No Express dependencies
- Reusable across different contexts
- Returns `{ error, value }` objects

### 2. **Middleware** (`/middlewares/`)
- Uses validators to check data format
- Handles HTTP responses for validation errors
- Sanitizes and prepares data for controllers
- Sets `req.validatedData` for controllers

### 3. **Controllers** (`/controllers/`)
- Contains business logic
- Performs database operations
- Handles business rules and validations
- Sends final HTTP responses

### 4. **Models** (`/models/`)
- MongoDB schemas with Mongoose
- Data validation at database level
- Auto-incrementing user IDs
- Timestamps and indexing

## 🔧 Key Components

### Database Schema
```javascript
// Auto-incrementing userId
userId: {
    type: Number,
    unique: true,
    index: true,
    default: async function() {
        const lastUser = await this.constructor.findOne({}, {}, { 
            sort: { userId: -1 } 
        });
        return lastUser ? lastUser.userId + 1 : 1;
    }
}
```

### Validation Schema
```javascript
const vendorRegistrationSchema = Joi.object({
    businessName: Joi.string().min(2).max(100).required(),
    ownerName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/[1-9][\d]{0,15}$/).required(),
    // ... more validation rules
});
```

### Error Handling
```javascript
// Custom error creation
const createError = (statusCode, message, details = null) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
};
```

### Logging
```javascript
// Structured logging with Winston
logger.info(`Vendor registered successfully: ${vendor.userId}`, {
    userId: vendor.userId,
    email: vendor.email,
    businessName: vendor.businessName
});
```

## Request Flow

## 👤 Users & Admin Workflow

### User Model (MongoDB)
- role: "admin" | "vendor"
- email: required, unique, lowercase
- password: required, hashed (bcrypt) on save
- last_login: Date
- is_active: Boolean (default: true)
- phone_number: String
- vendor_id: ObjectId → references `VendorRegister`
- timestamps: `createdAt`, `updatedAt`

Location: `backend/src/models/user.js`

### Admin-Controlled Flow
1) Vendor registers → saved in `VendorRegister` with `status = pending`.
2) Admin reviews and approves vendor.
3) Admin manually creates a vendor login by inserting into `User` with `vendor_id` of the approved vendor.
4) Only approved vendors with an active user record can log in.

This keeps the vendor↔user relationship via `vendor_id` and ensures admin control.

## 📡 API Endpoints (New)

Base paths as mounted in `server.js`:
- Admin: `/api/admin`
- Vendor (public): `/api/register/vendor`

### 1) Approve Vendor (Admin)
POST `/api/admin/vendors/approve`

Request:
```http
POST /api/admin/vendors/approve
Content-Type: application/json

{ "vendor_id": "<ObjectId>" }
```

Success Response:
```json
{ "success": true, "message": "Vendor approved", "data": { "vendor_id": "<ObjectId>" } }
```

Notes:
- Updates the vendor’s `status` to `approved` in `VendorRegister`.

### 2) Create Vendor User (Admin)
POST `/api/admin/users/create-vendor`

Request:
```http
POST /api/admin/users/create-vendor
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "StrongPass!23",
  "vendor_id": "<ObjectId>",
  "phone_number": "9876543210" // optional
}
```

Success Response:
```json
{
  "success": true,
  "message": "Vendor user created successfully",
  "data": { "id": "<ObjectId>", "email": "vendor@example.com", "role": "vendor", "vendor_id": "<ObjectId>" }
}
```

Validations:
- Vendor must exist and be `approved`.
- Email must be unique.
- Password is hashed automatically.

### 3) Activate/Deactivate User (Admin)
PATCH `/api/admin/users/:user_id/active`

Request:
```http
PATCH /api/admin/users/66e7f0c0d4a7c3c2b3c1a9f1/active
Content-Type: application/json

{ "is_active": true }
```

Success Response:
```json
{ "success": true, "message": "User state updated", "data": { "id": "<ObjectId>", "is_active": true } }
```

### 4) Get Approved Vendors (Public)
GET `/api/register/vendor/approved`

Description:
- Returns all vendors with `status = approved` and `isActive = true`.
- Sorted by newest first (`createdAt: -1`).
- Safe fields only (no sensitive data).

Request:
```http
GET /api/register/vendor/approved
```

Success Response:
```json
{
  "success": true,
  "data": [
    {
      "businessName": "John's Catering",
      "ownerName": "John Doe",
      "email": "john@catering.com",
      "phone": "1234567890",
      "city": "New York",
      "serviceArea": "Manhattan",
      "socialMedia": "https://instagram.com/johnscatering",
      "categories": ["catering", "events"],
      "images": ["https://..."],
      "videos": ["https://..."],
      "packages": ["basic", "premium"],
      "verificationStatus": { "emailVerified": false, "phoneVerified": false, "documentsVerified": false }
    }
  ]
}
```

Implementation:
- Controller: `getApprovedVendors` in `backend/src/controllers/vendorRegister.js`
- Route: `GET /approved` in `backend/src/routes/vendorRegisterRoute.js` (mounted at `/api/register/vendor`)

## 🔐 Admin Account Creation
- Create an admin user directly in the database (manual insert) with `role: "admin"`.
- Alternatively, add a protected admin creation route if needed.

## 🔄 Login Hook (Future)
- On successful login, update `last_login` on the `User` document.
- Enforce `is_active === true` and role checks during authentication.
