# Fala Farm Admin Interface Development Guide

## 1. Tech Stack Selection

Based on the existing codebase (NextJS application with TypeScript, Tailwind CSS) and the requirements from the PRD, the following tech stack is recommended for the admin mobile interface:

### 1.1 Mobile App
- **Framework**: React Native with Expo
  - Rationale: Leverages existing React knowledge, provides native mobile experience, and works on both iOS and Android
  - Expo simplifies development and testing while providing easy access to native APIs (camera, storage, etc.)

- **State Management**: Redux Toolkit or React Query
  - For handling complex state and offline data synchronization

- **UI Components**: React Native Paper or NativeBase
  - For consistent UI that can match the styling of the website

- **Offline Support**: Redux Persist + AsyncStorage
  - For storing data locally and providing offline functionality

### 1.2 Backend Extensions
- **API Layer**: REST API extensions to the current NextJS backend
  - Rationale: Can leverage existing infrastructure while adding mobile-specific endpoints

- **Authentication**: JWT with refresh tokens
  - Secure and suitable for mobile authentication flows
  - Works well with offline scenarios

- **Image Handling**: AWS S3 or similar cloud storage
  - For efficient image uploads from mobile devices
  - Image compression and processing before storage

- **Push Notifications**: Firebase Cloud Messaging (FCM)
  - For alerting admins about registrations or upcoming auctions

## 2. Architecture Design

### 2.1 High-Level Architecture
```
┌────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                │    │                 │    │                 │
│  Mobile Admin  │◄──►│  NextJS API     │◄──►│  Database       │
│  Application   │    │  Extensions     │    │  (Extended)     │
│                │    │                 │    │                 │
└────────────────┘    └─────────────────┘    └─────────────────┘
        ▲                     ▲                      ▲
        │                     │                      │
        ▼                     ▼                      ▼
┌────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                │    │                 │    │                 │
│  Image Storage │    │  Public Website │    │  Email Service  │
│  (Cloud)       │    │  (NextJS)       │    │  (Resend.com)   │
│                │    │                 │    │                 │
└────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 Data Flow
1. Admin authenticates via mobile app
2. App syncs latest data from the NextJS API
3. Admin performs actions offline if needed
4. Data is synchronized when connection is available
5. NextJS API updates the database, which reflects on the public website

## 3. Database Schema Extensions

The current application likely uses a database (not explicitly visible in the provided code), but we need to extend it to support the new features:

### 3.1 New Database Tables

#### `users` Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  refresh_token VARCHAR(255)
);
```

#### `breeding_animals` Table
```sql
CREATE TABLE breeding_animals (
  id SERIAL PRIMARY KEY,
  ear_tag VARCHAR(50) NOT NULL UNIQUE,
  animal_type VARCHAR(50) NOT NULL,
  birth_type VARCHAR(50) NOT NULL,
  growth_rate INTEGER,
  yearly_weight DECIMAL(5,2),
  lamb_index DECIMAL(5,2),
  weaner_growth INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### `animal_images` Table
```sql
CREATE TABLE animal_images (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES breeding_animals(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `commercial_lots` Table
```sql
CREATE TABLE commercial_lots (
  id SERIAL PRIMARY KEY,
  lot_number VARCHAR(50) NOT NULL,
  lambing_date DATE NOT NULL,
  weight_min DECIMAL(5,2),
  weight_max DECIMAL(5,2),
  price DECIMAL(10,2),
  quantity INTEGER,
  health_certificates TEXT[],
  availability_date DATE,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### `lot_images` Table
```sql
CREATE TABLE lot_images (
  id SERIAL PRIMARY KEY,
  lot_id INTEGER REFERENCES commercial_lots(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `auctions` Table
```sql
CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  auction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `auction_animals` Table
```sql
CREATE TABLE auction_animals (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
  animal_id INTEGER REFERENCES breeding_animals(id) ON DELETE CASCADE,
  starting_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'listed' CHECK (status IN ('listed', 'sold', 'not_sold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `auction_registrations` Table
```sql
CREATE TABLE auction_registrations (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notification_sent BOOLEAN DEFAULT FALSE
);
```

#### `email_templates` Table
```sql
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Modifications to Existing Database (If Any)

If there are existing tables in the current application that handle similar data, they should be migrated to this new schema or modified to accommodate the additional fields.

## 4. API Endpoints

The following new API endpoints need to be added to the NextJS application:

### 4.1 Authentication
- `POST /api/auth/login` - Authenticate user and return JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate refresh token

### 4.2 Breeding Animals
- `GET /api/animals` - Get all breeding animals with pagination
- `GET /api/animals/:id` - Get specific animal details
- `POST /api/animals` - Create new breeding animal
- `PUT /api/animals/:id` - Update animal information
- `DELETE /api/animals/:id` - Mark animal as inactive/sold

### 4.3 Images
- `POST /api/images/upload` - Upload images (with multipart/form-data)
- `POST /api/animals/:id/images` - Associate images with an animal
- `DELETE /api/images/:id` - Delete an image

### 4.4 Commercial Lots
- `GET /api/lots` - Get all commercial lots with pagination
- `GET /api/lots/:id` - Get specific lot details
- `POST /api/lots` - Create new commercial lot
- `PUT /api/lots/:id` - Update lot information
- `DELETE /api/lots/:id` - Mark lot as inactive/sold

### 4.5 Auctions
- `GET /api/auctions` - Get all auctions with pagination
- `GET /api/auctions/:id` - Get specific auction details
- `POST /api/auctions` - Create new auction
- `PUT /api/auctions/:id` - Update auction information
- `DELETE /api/auctions/:id` - Cancel auction

### 4.6 Auction Registrations
- `GET /api/auctions/:id/registrations` - Get registrations for an auction
- `POST /api/auctions/:id/registrations` - Add a manual registration
- `POST /api/auctions/:id/notify` - Send notifications to registrants

## 5. Security Implementation

### 5.1 Authentication Security
- JWT tokens with short expiration (15-30 minutes)
- Secure HTTP-only cookies for refresh tokens
- Rate limiting on authentication endpoints
- Password hashing with bcrypt and appropriate salt rounds
- Account lockout after multiple failed attempts

### 5.2 API Security
- HTTPS for all connections
- Input validation with zod (already used in the project)
- Request sanitization
- CORS configuration allowing only the mobile app and web admin
- API rate limiting to prevent abuse
- Request size limits for uploads

### 5.3 Mobile App Security
- Secure local storage of tokens
- App timeout after inactivity
- Optional biometric authentication
- Local data encryption
- Certificate pinning for API communications
- Detection of rooted/jailbroken devices

### 5.4 Data Security
- PII (Personally Identifiable Information) encryption
- Regular backups of database
- Audit logging for sensitive operations
- Sanitization of user inputs

## 6. NextJS App Changes

The following changes are needed in the current NextJS application:

### 6.1 Authentication System
- Implement the authentication API endpoints
- Add middleware for JWT verification
- Create user management system

### 6.2 Database Integration
- Set up database connection (if not already present)
- Create migrations for the new tables
- Implement data models and repositories

### 6.3 API Routes
- Implement all the new API endpoints
- Add appropriate validation and error handling
- Ensure proper authorization checks

### 6.4 Image Handling
- Configure cloud storage integration
- Implement image upload and processing logic
- Create image optimization middleware

### 6.5 Email Notifications
- Enhance existing email service for auction notifications
- Implement email template system
- Set up queue system for bulk emails

## 7. Implementation Plan

### 7.1 Phase 1: Backend Foundation (4 weeks)
- Set up database schema extensions
- Implement authentication system
- Create core API endpoints
- Configure image storage solution

### 7.2 Phase 2: Mobile App Infrastructure (4 weeks)
- Initialize React Native project
- Implement authentication flow
- Create offline storage architecture
- Build basic UI components

### 7.3 Phase 3: Feature Implementation (6 weeks)
- Breeding animal management
- Commercial lot management
- Auction management
- Image upload functionality
- Notification system

### 7.4 Phase 4: Integration and Testing (3 weeks)
- Connect mobile app to backend
- Implement offline sync
- Perform security testing
- User acceptance testing

### 7.5 Phase 5: Deployment and Monitoring (3 weeks)
- App store submissions
- Backend deployment
- Setup monitoring tools
- Initial user training

## 8. Technical Considerations

### 8.1 Offline Support
The mobile app needs to function without consistent internet connection. This requires:
- Local storage of entered data
- Optimistic UI updates
- Conflict resolution when syncing
- Background synchronization when connection is restored

### 8.2 Image Handling
Efficient image handling is critical:
- Client-side compression before upload
- Progressive loading for faster display
- Caching strategies for downloaded images
- Batch upload support for multiple images

### 8.3 Performance
- API payload optimization
- Pagination for large data sets
- Lazy loading where appropriate
- Battery usage optimization

### 8.4 Continuous Integration
- Set up CI/CD for both mobile app and backend changes
- Automated testing for API endpoints
- Regression testing for website compatibility

## 9. Mobile App Structure

```
src/
├── api/                 # API client and endpoints
├── assets/              # Static assets
├── components/          # UI components
│   ├── animals/         # Animal-related components
│   ├── auctions/        # Auction-related components
│   ├── common/          # Shared components
│   └── lots/            # Commercial lot components
├── hooks/               # Custom hooks
├── navigation/          # Navigation configuration
├── screens/             # App screens
│   ├── auth/            # Authentication screens
│   ├── animals/         # Animal management screens
│   ├── auctions/        # Auction management screens
│   ├── lots/            # Commercial lot screens
│   └── profile/         # User profile screens
├── store/               # State management
│   ├── slices/          # Redux slices
│   └── sync/            # Sync logic
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## 10. Monitoring and Analytics

To ensure the app is functioning correctly and to identify issues:

### 10.1 Error Tracking
- Implement crash reporting (Sentry or similar)
- Track API failures
- Monitor sync issues

### 10.2 Performance Monitoring
- Track app load times
- Monitor API response times
- Image upload/download performance

### 10.3 Usage Analytics
- Feature usage patterns
- Session duration
- Common workflows

This will help identify pain points and areas for improvement. 