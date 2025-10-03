
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

#### 1. **Successful Vendor Registration**

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

---

# 🌐 Public Vendors API (New)

## Overview

The Public Vendors API allows clients to browse approved vendors without exposing sensitive information like business names, owner names, contact details, or documents. This ensures privacy while enabling vendor discovery and selection.

## API Endpoints

### 1. Get All Public Vendors

**GET** `/api/public/vendors`

Browse all approved vendors with filtering and pagination support.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `city` | String | - | Filter by city name |
| `category` | String | - | Filter by service category |
| `serviceArea` | String | - | Filter by service area |
| `limit` | Number | 20 | Results per page (max 100) |
| `page` | Number | 1 | Page number |
| `sortBy` | String | 'createdAt' | Sort field |
| `sortOrder` | String | 'desc' | Sort direction ('asc' or 'desc') |

#### Example Request

```http
GET /api/public/vendors?city=Mumbai&category=Photography&limit=10&page=1
```

#### Example Response

```json
{
  "success": true,
  "message": "Vendors fetched successfully",
  "data": {
    "vendors": [
      {
        "vendorId": 123,
        "city": "Mumbai",
        "serviceArea": "South Mumbai",
        "categories": ["Photography", "Wedding"],
        "otherCategories": ["Corporate Events"],
        "portfolio": {
          "images": [
            "https://res.cloudinary.com/example/image1.jpg",
            "https://res.cloudinary.com/example/image2.jpg"
          ],
          "videos": [
            "https://res.cloudinary.com/example/video1.mp4"
          ]
        },
        "packages": [
          {
            "name": "Basic Package",
            "price": "₹25000",
            "description": "5 hours coverage, 200 photos"
          },
          {
            "name": "Premium Package", 
            "price": "₹45000",
            "description": "8 hours coverage, 500 photos, video highlights"
          }
        ],
        "profilePhoto": "https://res.cloudinary.com/example/profile.jpg",
        "joinedDate": "2024-01-15T10:30:00.000Z",
        "rating": {
          "averageRating": 4.5,
          "totalReviews": 12
        },
        "responseTime": "within-24h",
        "isVerified": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalVendors": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "applied": {
        "city": "Mumbai",
        "category": "Photography"
      },
      "available": {
        "cities": ["Mumbai", "Delhi", "Bangalore", "Chennai"],
        "categories": ["Photography", "Catering", "Decoration", "Music"],
        "serviceAreas": ["South Mumbai", "North Delhi", "Whitefield"]
      }
    }
  }
}
```

### 2. Get Specific Vendor Details

**GET** `/api/public/vendors/:id`

Get detailed information about a specific vendor by their numeric ID.

#### Example Request

```http
GET /api/public/vendors/123
```

#### Example Response

```json
{
  "success": true,
  "message": "Vendor details fetched successfully",
  "data": {
    "vendorId": 123,
    "city": "Mumbai",
    "serviceArea": "South Mumbai",
    "categories": ["Photography", "Wedding"],
    "otherCategories": ["Corporate Events"],
    "portfolio": {
      "images": [
        "https://res.cloudinary.com/example/image1.jpg",
        "https://res.cloudinary.com/example/image2.jpg"
      ],
      "videos": [
        "https://res.cloudinary.com/example/video1.mp4"
      ]
    },
    "packages": [
      {
        "name": "Basic Package",
        "price": "₹25000",
        "description": "5 hours coverage, 200 photos"
      }
    ],
    "profilePhoto": "https://res.cloudinary.com/example/profile.jpg",
    "joinedDate": "2024-01-15T10:30:00.000Z",
    "rating": {
      "averageRating": 4.5,
      "totalReviews": 12,
      "reviews": [
        {
          "rating": 5,
          "comment": "Excellent photography service!",
          "date": "2024-01-20T15:30:00.000Z"
        }
      ]
    },
    "responseTime": "within-24h",
    "isVerified": true,
    "about": {
      "description": "Professional event service provider with years of experience"
    },
    "availability": {
      "status": "available",
      "nextAvailableDate": "2024-02-01T00:00:00.000Z"
    }
  }
}
```

## Security Features

### ✅ Publicly Available Data

- `vendorId` - Numeric identifier (not MongoDB ObjectId)
- `city` and `serviceArea` - Location information
- `categories` and `otherCategories` - Service categories
- `portfolio` - Images and videos
- `packages` - Service packages with pricing
- `profilePhoto` - Vendor profile image
- `joinedDate` - When vendor joined the platform
- `rating` - Average rating and review count
- `responseTime` - Expected response time
- `isVerified` - Verification status

### ❌ Protected Data (Never Exposed)

- `businessName` - Business name
- `ownerName` - Owner name
- `email` - Email address
- `phone` - Phone number
- `socialMedia` - Social media links
- `documents` - GST, business proof, ID proof
- `bankDetails` - Banking information
- `verificationStatus` - Detailed verification info
- `upiId` - UPI ID

## Error Handling

### Vendor Not Found

```json
{
  "success": false,
  "message": "Vendor not found or not available"
}
```

### Invalid Parameters

```json
{
  "success": false,
  "message": "Invalid parameters",
  "error": "Limit must be between 1 and 100"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Failed to fetch vendors",
  "error": "Internal server error"
}
```

## Testing

### Test Script

Run the included test script to validate the API:

```bash
cd backend
node test-public-vendors-api.js
```

### Manual Testing with cURL

```bash
# Get all vendors
curl -X GET "http://localhost:3000/api/public/vendors"

# Filter by city
curl -X GET "http://localhost:3000/api/public/vendors?city=Mumbai"

# Filter by category
curl -X GET "http://localhost:3000/api/public/vendors?category=Photography"

# Pagination
curl -X GET "http://localhost:3000/api/public/vendors?page=2&limit=5"

# Get specific vendor
curl -X GET "http://localhost:3000/api/public/vendors/123"
```

### Postman Collection

Add these requests to your Postman collection:

```json
{
  "name": "Public Vendors API",
  "item": [
    {
      "name": "Get All Public Vendors",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/public/vendors"
      }
    },
    {
      "name": "Get Vendors with Filters",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/public/vendors?city=Mumbai&category=Photography&limit=10"
      }
    },
    {
      "name": "Get Specific Vendor",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/public/vendors/123"
      }
    }
  ]
}
```

## Implementation Details

### Files Created

- `backend/src/routes/publicRoutes.js` - Public API routes
- `backend/src/controllers/publicController.js` - Controller logic
- `backend/test-public-vendors-api.js` - Test script

### Database Queries

The API uses MongoDB aggregation to:
- Filter vendors by status (`approved`) and activity (`isActive: true`)
- Exclude sensitive fields from the response
- Support filtering, sorting, and pagination
- Aggregate available filter options

### Performance Considerations

- Indexed fields: `status`, `isActive`, `city`, `categories`
- Pagination limits: Maximum 100 results per page
- Caching: Available filter options are cached
- Query optimization: Uses MongoDB `select()` to limit returned fields

## Future Enhancements

1. **Rating System** - Implement actual client reviews and ratings
2. **Response Time Tracking** - Track actual vendor response times
3. **Availability Calendar** - Show vendor availability dates
4. **Advanced Filtering** - Filter by price range, rating, verification status
5. **Search Functionality** - Full-text search across vendor portfolios
6. **Caching** - Redis caching for frequently accessed data
7. **Analytics** - Track vendor view counts and popular searches

---

# 🔗 Complete API Reference with cURL Examples

## Authentication

### Admin Login
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword"
  }'
```

### Vendor Login
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "vendorpassword"
  }'
```

---

## 🌐 Public APIs (No Authentication Required)

### 1. Browse All Vendors
```bash
# Get all approved vendors
curl -X GET "http://localhost:3000/api/public/vendors"

# Filter by city
curl -X GET "http://localhost:3000/api/public/vendors?city=Mumbai"

# Filter by category
curl -X GET "http://localhost:3000/api/public/vendors?category=Photography"

# Filter by service area
curl -X GET "http://localhost:3000/api/public/vendors?serviceArea=South%20Mumbai"

# Combined filters with pagination
curl -X GET "http://localhost:3000/api/public/vendors?city=Mumbai&category=Photography&limit=10&page=1"

# Sort by creation date
curl -X GET "http://localhost:3000/api/public/vendors?sortBy=createdAt&sortOrder=desc"
```

### 2. Get Specific Vendor Details
```bash
# Get vendor details by ID (numeric ID, not MongoDB ObjectId)
curl -X GET "http://localhost:3000/api/public/vendors/123"
```

### 3. Submit Vendor Request
```bash
curl -X POST "http://localhost:3000/api/public/vendor-requests" \
  -H "Content-Type: application/json" \
  -d '{
    "clientInfo": {
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "9876543210",
      "city": "Mumbai"
    },
    "eventDetails": {
      "eventType": "Wedding",
      "eventDate": "2024-06-15T18:00:00.000Z",
      "guestCount": 150,
      "budget": 500000,
      "location": "Taj Hotel, Mumbai",
      "specialRequirements": "Need vegetarian catering and live music"
    },
    "selectedVendorId": 123,
    "preferences": {
      "preferredContactTime": "evening",
      "urgency": "medium",
      "communicationMethod": "phone"
    }
  }'
```

### 4. Check Request Status
```bash
# Get request status by request ID
curl -X GET "http://localhost:3000/api/public/vendor-requests/1"
```

### 5. Get Client Request History
```bash
# Get all requests for a specific client by email
curl -X GET "http://localhost:3000/api/public/client-requests/john.smith@example.com"
```

---

## 👑 Admin APIs (Authentication Required)

### 1. Admin Dashboard - All Vendor Requests
```bash
# Get all vendor requests (requires admin JWT token)
curl -X GET "http://localhost:3000/api/admin/vendor-requests" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by status
curl -X GET "http://localhost:3000/api/admin/vendor-requests?status=pending" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by event type
curl -X GET "http://localhost:3000/api/admin/vendor-requests?eventType=Wedding" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by city
curl -X GET "http://localhost:3000/api/admin/vendor-requests?city=Mumbai" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Filter by urgency
curl -X GET "http://localhost:3000/api/admin/vendor-requests?urgency=high" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Date range filter
curl -X GET "http://localhost:3000/api/admin/vendor-requests?dateFrom=2024-06-01&dateTo=2024-06-30" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Combined filters with pagination
curl -X GET "http://localhost:3000/api/admin/vendor-requests?status=pending&eventType=Wedding&city=Mumbai&limit=10&page=1" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Sort by event date
curl -X GET "http://localhost:3000/api/admin/vendor-requests?sortBy=eventDetails.eventDate&sortOrder=asc" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 2. Assign Vendor to Request
```bash
# Assign vendor to pending request
curl -X POST "http://localhost:3000/api/admin/vendor-requests/1/assign" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedVendorId": 123,
    "adminNotes": "Assigned based on client requirements and vendor availability"
  }'

# Assign with override (different from client's choice)
curl -X POST "http://localhost:3000/api/admin/vendor-requests/1/assign" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedVendorId": 456,
    "adminNotes": "Overriding client choice - selected vendor has better availability for this event date"
  }'
```

### 3. Update Request Status
```bash
# Mark request as in progress
curl -X PATCH "http://localhost:3000/api/admin/vendor-requests/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "adminNotes": "Vendor has started working on the event"
  }'

# Mark request as completed
curl -X PATCH "http://localhost:3000/api/admin/vendor-requests/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "adminNotes": "Event completed successfully"
  }'

# Cancel request
curl -X PATCH "http://localhost:3000/api/admin/vendor-requests/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "adminNotes": "Request cancelled by client"
  }'
```

### 4. Vendor Management
```bash
# Get all vendors
curl -X GET "http://localhost:3000/api/admin/vendors" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get vendors by status
curl -X GET "http://localhost:3000/api/admin/vendors?status=approved" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get vendors by city
curl -X GET "http://localhost:3000/api/admin/vendors?city=Mumbai" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get vendors by category
curl -X GET "http://localhost:3000/api/admin/vendors?category=Photography" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get specific vendor details
curl -X GET "http://localhost:3000/api/admin/vendors/VENDOR_OBJECT_ID" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Approve vendor
curl -X POST "http://localhost:3000/api/admin/vendors/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "vendor_id": "VENDOR_OBJECT_ID"
  }'

# Update vendor status
curl -X PATCH "http://localhost:3000/api/admin/vendors/VENDOR_OBJECT_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "status": "approved"
  }'
```

### 5. User Management
```bash
# Create vendor user account
curl -X POST "http://localhost:3000/api/admin/users/create-vendor" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "email": "vendor@example.com",
    "password": "SecurePassword123!",
    "phone_number": "9876543210",
    "vendor_id": "VENDOR_OBJECT_ID",
    "businessName": "Royal Catering",
    "ownerName": "John Doe",
    "city": "Mumbai",
    "serviceArea": "South Mumbai",
    "categories": ["catering"],
    "othersCategories": ["corporate events"]
  }'

# Get all vendor users
curl -X GET "http://localhost:3000/api/admin/users/vendors" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get vendor users by active status
curl -X GET "http://localhost:3000/api/admin/users/vendors?active=true" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Search vendor users by email
curl -X GET "http://localhost:3000/api/admin/users/vendors?search=vendor@example.com" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Activate/Deactivate user
curl -X PATCH "http://localhost:3000/api/admin/users/USER_OBJECT_ID/active" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "is_active": true
  }'

# Update vendor user details
curl -X PUT "http://localhost:3000/api/admin/users/vendor/VENDOR_OBJECT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "businessName": "Updated Business Name",
    "ownerName": "Updated Owner Name",
    "city": "Updated City",
    "serviceArea": "Updated Service Area",
    "categories": ["catering", "events"],
    "phone_number": "9876543210"
  }'
```

---

## 📧 Email APIs

### Send Vendor Email
```bash
curl -X POST "http://localhost:3000/api/vendorEmail/send" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "vendor@example.com",
    "subject": "Welcome to OccasionSuper",
    "html": "<h1>Welcome!</h1><p>Your vendor account has been approved.</p>"
  }'
```

---

## 📁 File Upload APIs

### Upload Files
```bash
# Upload single file
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@/path/to/your/file.jpg"

# Upload multiple files (repeat the -F parameter)
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@/path/to/image1.jpg" \
  -F "file=@/path/to/image2.jpg"
```

---

## 🏙️ Utility APIs

### Get Cities (Auto-complete)
```bash
# Search for cities
curl -X GET "http://localhost:3000/api/cities?q=Mumbai"

# Get multiple city suggestions
curl -X GET "http://localhost:3000/api/cities?q=Delhi"
```

---

## 🔐 Authentication Headers

For authenticated endpoints, always include the JWT token:

```bash
# Get token from login response, then use in subsequent requests
-H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📊 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field validation error"
    }
  ]
}
```

---

## 🧪 Testing Scripts

### Test Public Vendors API
```bash
cd backend
node test-public-vendors-api.js
```

### Test Vendor Request API
```bash
cd backend
node test-vendor-request-api.js
```

### Test Admin API
```bash
cd backend
# Update ADMIN_TOKEN in the test file first
node test-admin-vendor-requests-api.js
```

### Test Admin Assignment API
```bash
cd backend
# Update ADMIN_TOKEN in the test file first
node test-admin-assignment-api.js
```

---

## 🔄 Admin Assignment Workflow

### Complete Vendor-to-Client Assignment Process

The admin assignment system provides a comprehensive workflow for managing vendor requests:

#### 1. **Client Submits Request**
```bash
# Client browses vendors and submits request
curl -X POST "http://localhost:3000/api/public/vendor-requests" \
  -H "Content-Type: application/json" \
  -d '{
    "clientInfo": { "name": "John Smith", "email": "john@example.com", "phone": "9876543210", "city": "Mumbai" },
    "eventDetails": { "eventType": "Wedding", "eventDate": "2024-06-15T18:00:00.000Z", "guestCount": 150, "budget": 500000, "location": "Taj Hotel", "specialRequirements": "Vegetarian catering" },
    "selectedVendorId": 123,
    "preferences": { "urgency": "medium", "communicationMethod": "phone" }
  }'
```

#### 2. **Admin Reviews Pending Requests**
```bash
# Admin gets all pending requests
curl -X GET "http://localhost:3000/api/admin/vendor-requests?status=pending" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### 3. **Admin Assigns Vendor**
```bash
# Admin assigns vendor (can override client's choice)
curl -X POST "http://localhost:3000/api/admin/vendor-requests/1/assign" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedVendorId": 456,
    "adminNotes": "Assigned better vendor based on availability and expertise"
  }'
```

#### 4. **Track Request Progress**
```bash
# Mark as in progress
curl -X PATCH "http://localhost:3000/api/admin/vendor-requests/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress", "adminNotes": "Vendor started work"}'

# Mark as completed
curl -X PATCH "http://localhost:3000/api/admin/vendor-requests/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed", "adminNotes": "Event completed successfully"}'
```

#### 5. **Client Checks Status**
```bash
# Client can check their request status
curl -X GET "http://localhost:3000/api/public/vendor-requests/1"
```

### Key Features

- **Admin Override**: Admin can assign different vendor than client selected
- **Conflict Prevention**: Prevents vendor double-booking on same event date
- **Status Tracking**: Complete lifecycle from pending to completed
- **Audit Trail**: Tracks who assigned, when, and if it was an override
- **Client Communication**: Provides vendor contact details after assignment

---

## 📝 Notes

1. **Base URL**: All endpoints use `http://localhost:3000` as the base URL
2. **Authentication**: Admin and vendor endpoints require JWT authentication
3. **Content-Type**: Use `application/json` for POST/PUT/PATCH requests
4. **File Uploads**: Use `multipart/form-data` for file upload endpoints
5. **Pagination**: Use `limit` and `page` parameters for paginated results
6. **Filtering**: Most list endpoints support various filter parameters
7. **Error Handling**: Always check the `success` field in responses
