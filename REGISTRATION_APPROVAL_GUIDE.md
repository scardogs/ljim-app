# Registration Approval System - Complete Guide

## Overview

The LJIM Admin Registration Approval System allows existing administrators to review and approve new admin registration requests before granting access. This adds an extra layer of security and control over who can access the admin panel.

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [User Registration Flow](#user-registration-flow)
3. [Admin Approval Flow](#admin-approval-flow)
4. [Files & Structure](#files--structure)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Usage Instructions](#usage-instructions)
8. [Security Features](#security-features)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)

---

## How It Works

### Workflow Overview

```
User submits request → Admin reviews → Admin approves →
User receives link → User sets password → Account created
```

### Key Features

- ✅ Request-based registration system
- ✅ Admin approval workflow
- ✅ Secure approval tokens (7-day expiration)
- ✅ Rejection with optional reasons
- ✅ Request management dashboard
- ✅ Statistics and filtering
- ✅ Copy-to-clipboard approval links

---

## User Registration Flow

### Step 1: Submit Registration Request

**Page:** `/register`

Users fill out a simple form with:

- Full Name (required)
- Email (required)
- Message (optional) - why they need access

**What Happens:**

1. Form validates email doesn't already exist
2. Checks for duplicate pending requests
3. Creates a `RegistrationRequest` document with status "pending"
4. Shows success message
5. Redirects to homepage

### Step 2: Wait for Approval

- Request appears in admin dashboard
- User waits for admin to approve
- (Optional: Email notification can be configured)

### Step 3: Complete Registration

**Page:** `/register/complete?token={approval_token}`

After admin approval:

1. User receives approval link
2. Clicks link to open registration completion page
3. Token is validated (checks expiration and validity)
4. User sets a password
5. Account is created automatically
6. User is logged in and redirected to admin dashboard

---

## Admin Approval Flow

### Accessing Registration Requests

1. Log in to admin panel
2. Navigate to **"Registration Requests"** in sidebar
3. View dashboard with statistics and requests

### Dashboard Features

**Statistics Cards:**

- Pending requests count
- Approved requests count
- Rejected requests count

**Tabs:**

- **Pending** - Requests awaiting approval
- **Approved** - Already approved requests
- **Rejected** - Rejected requests
- **All** - Complete list

### Approving a Request

1. Click the **green checkmark** button on a pending request
2. System generates approval token and link
3. Modal displays the approval link
4. **Copy the link** and share with the user
5. Link expires in 7 days

**Approval Link Format:**

```
http://localhost:3000/register/complete?token=abc123...
```

### Rejecting a Request

1. Click the **red X** button on a pending request
2. Modal opens asking for rejection reason (optional)
3. Enter reason and confirm
4. Request status changes to "rejected"
5. (Optional: Email notification can be configured)

### Deleting a Request

1. Click the **trash icon** on any request
2. Confirm deletion in alert dialog
3. Request is permanently removed

---

## Files & Structure

### New Files Created

```
models/
  └── RegistrationRequest.js           # Database model

src/
  ├── pages/
  │   ├── register.js                   # Updated to submit requests
  │   ├── register/
  │   │   └── complete.js              # Password setup page
  │   └── api/
  │       ├── auth/
  │       │   ├── registration-request.js      # Submit request
  │       │   └── complete-registration.js     # Verify & complete
  │       └── admin/
  │           ├── registration-requests.js     # List & delete
  │           └── registration-requests/
  │               └── [id]/
  │                   ├── approve.js           # Approve request
  │                   └── reject.js            # Reject request
  └── components/
      └── admin/
          └── RegistrationRequestManager.js   # Admin UI component
```

### Modified Files

```
src/pages/admin/index.js                # Added new section
```

---

## API Endpoints

### Public Endpoints

#### Submit Registration Request

```http
POST /api/auth/registration-request
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I need admin access for content management"
}

Response: 201 Created
{
  "success": true,
  "message": "Registration request submitted successfully...",
  "request": { ... }
}
```

#### Get Registration Details (Token Verification)

```http
GET /api/auth/complete-registration?token={approval_token}

Response: 200 OK
{
  "valid": true,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Complete Registration

```http
POST /api/auth/complete-registration
Content-Type: application/json

{
  "token": "abc123...",
  "password": "securepassword123"
}

Response: 201 Created
{
  "success": true,
  "token": "jwt_token...",
  "user": { ... }
}
```

### Admin Endpoints (Require Authentication)

#### List All Requests

```http
GET /api/admin/registration-requests
Authorization: Bearer {admin_token}

Optional Query: ?status=pending|approved|rejected|all

Response: 200 OK
{
  "requests": [ ... ]
}
```

#### Approve Request

```http
POST /api/admin/registration-requests/{id}/approve
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "success": true,
  "message": "Registration request approved successfully",
  "approvalLink": "http://...",
  "request": { ... }
}
```

#### Reject Request

```http
POST /api/admin/registration-requests/{id}/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Not authorized for admin access"
}

Response: 200 OK
{
  "success": true,
  "message": "Registration request rejected",
  "request": { ... }
}
```

#### Delete Request

```http
DELETE /api/admin/registration-requests
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "id": "request_id"
}

Response: 200 OK
{
  "success": true,
  "message": "Registration request deleted successfully"
}
```

---

## Database Models

### RegistrationRequest Model

```javascript
{
  name: String (required),              // User's full name
  email: String (required, lowercase),  // User's email
  message: String,                      // Optional message
  status: String,                       // "pending" | "approved" | "rejected"
  approvedBy: ObjectId (ref: Admin),    // Who approved it
  approvalToken: String,                // Unique approval token
  approvalExpires: Date,                // Token expiration (7 days)
  rejectionReason: String,              // Reason for rejection
  createdAt: Date,                      // Auto-generated
  updatedAt: Date                       // Auto-generated
}
```

---

## Usage Instructions

### For Users

1. **Visit Registration Page**

   - Go to `/register`
   - Fill out name, email, and optional message
   - Click "Submit Request"

2. **Wait for Approval**

   - You'll see a success message
   - Wait for admin to approve your request
   - Check your email for approval link (if configured)

3. **Complete Registration**
   - Click the approval link received from admin
   - Set your password (min 6 characters)
   - Confirm password
   - Click "Complete Registration"
   - You'll be automatically logged in

### For Admins

1. **Access Registration Requests**

   - Log in to admin panel
   - Click "Registration Requests" in sidebar

2. **Review Pending Requests**

   - View request details (name, email, message)
   - Check submission date

3. **Approve Request**

   - Click green checkmark
   - Copy the approval link from modal
   - Share link with the user via email or other means

4. **Reject Request** (if needed)

   - Click red X button
   - Optionally provide rejection reason
   - Confirm rejection

5. **Manage Requests**
   - Switch between tabs to view different statuses
   - Delete old/processed requests as needed

---

## Security Features

### Token Security

- **Random Token Generation:** Uses `crypto.randomBytes(32)` for secure tokens
- **Expiration:** Tokens expire after 7 days
- **Single Use:** Tokens are invalidated after successful registration
- **Validation:** Tokens checked for validity and expiration

### Email Validation

- **Duplicate Prevention:** Checks if email already exists as admin
- **Pending Check:** Prevents duplicate pending requests
- **Lowercase Storage:** All emails stored in lowercase

### Password Security

- **Minimum Length:** 6 characters required
- **Bcrypt Hashing:** Passwords hashed with bcrypt (10 salt rounds)
- **Confirmation:** Password confirmation required

### Authorization

- **JWT Authentication:** All admin endpoints require valid JWT token
- **Role-Based:** Only authenticated admins can approve/reject
- **Session Management:** Proper token verification

---

## Customization

### Email Notifications (Optional)

To add email notifications, integrate with your email service:

**Files to modify:**

- `src/pages/api/admin/registration-requests/[id]/approve.js`
- `src/pages/api/admin/registration-requests/[id]/reject.js`

**Example integration:**

```javascript
// After approval
await sendEmail({
  to: request.email,
  subject: "Admin Access Approved",
  template: "approval",
  data: {
    name: request.name,
    approvalLink: approvalLink,
  },
});
```

### Token Expiration Time

**File:** `src/pages/api/admin/registration-requests/[id]/approve.js`

**Change:**

```javascript
// Current: 7 days
const approvalExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// Example: 24 hours
const approvalExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
```

### Custom Messages

**Registration Request Success:**

- File: `src/pages/register.js`
- Line: ~76-81

**Approval Success:**

- File: `src/components/admin/RegistrationRequestManager.js`
- Line: ~113-118

---

## Troubleshooting

### Issue: "Invalid or expired approval link"

**Possible Causes:**

- Token has expired (>7 days old)
- Token was already used
- Token is invalid or corrupted

**Solution:**

- Request admin to approve the request again
- Submit a new registration request

### Issue: "This email is already registered"

**Cause:** Email already exists in Admin database

**Solution:**

- Use the login page instead
- Contact administrator to reset password

### Issue: "A registration request for this email is already pending"

**Cause:** There's already a pending request with this email

**Solution:**

- Wait for admin to process existing request
- Contact administrator to check status

### Issue: Registration requests not appearing in admin panel

**Possible Causes:**

- Database connection issue
- Authentication token expired

**Solution:**

1. Check MongoDB connection
2. Log out and log back in to admin panel
3. Refresh the page
4. Check browser console for errors

### Issue: Cannot copy approval link

**Cause:** Browser clipboard permissions

**Solution:**

- Manually select and copy the link text
- Grant clipboard permissions in browser
- Try a different browser

---

## Environment Variables

Ensure these are set in `.env.local`:

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# For approval links
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional (for email notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=LJIM Admin
```

---

## Best Practices

1. **Regular Cleanup:** Periodically delete old processed requests
2. **Quick Response:** Approve/reject requests promptly
3. **Communication:** Always send approval links to users
4. **Security:** Never share approval tokens publicly
5. **Monitoring:** Check pending requests regularly
6. **Documentation:** Keep rejection reasons clear and professional

---

## Future Enhancements

Potential improvements for this system:

- [ ] Email notifications for approval/rejection
- [ ] Automatic approval link sending
- [ ] SMS notifications option
- [ ] Request expiration (auto-delete old pending requests)
- [ ] Bulk approval/rejection
- [ ] Export requests to CSV
- [ ] Request comments/notes
- [ ] Approval workflow with multiple approvers
- [ ] Integration with Slack/Discord for notifications

---

## Support

For issues or questions about the registration approval system:

1. Check this documentation
2. Review error messages in browser console
3. Check API responses in Network tab
4. Verify database records in MongoDB
5. Contact system administrator

---

## Summary

The Registration Approval System provides:

✅ **Security:** Control who gets admin access  
✅ **Transparency:** Clear approval workflow  
✅ **Tracking:** Complete history of requests  
✅ **User-Friendly:** Simple interface for both users and admins  
✅ **Flexible:** Easy to customize and extend

This system ensures that only authorized users can access the admin panel while maintaining a smooth onboarding experience.

---

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Author:** LJIM Development Team
