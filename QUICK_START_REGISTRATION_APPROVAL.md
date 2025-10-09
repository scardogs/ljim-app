# Quick Start: Registration Approval System

A step-by-step guide to use the new registration approval workflow.

---

## 🚀 For New Users (Requesting Admin Access)

### Step 1: Submit Your Request

1. Visit: `http://localhost:3000/register`
2. Fill in the form:
   - **Full Name:** Your complete name
   - **Email:** Your email address
   - **Message (Optional):** Why you need admin access
3. Click **"Submit Request"**
4. You'll see a success message
5. Wait for an admin to approve your request

### Step 2: Complete Registration

1. You'll receive an approval link from an admin (via email or message)
2. Click the link (format: `/register/complete?token=...`)
3. Set your password (minimum 6 characters)
4. Confirm your password
5. Click **"Complete Registration"**
6. You'll be automatically logged in!

---

## 👨‍💼 For Admins (Approving Requests)

### Access the Dashboard

1. Log in to admin panel: `http://localhost:3000/admin`
2. Click **"Registration Requests"** in the sidebar
3. View pending requests

### Approve a Request

1. Find the request in the **"Pending"** tab
2. Click the **green checkmark ✓** button
3. A modal will show the approval link
4. Click the **copy icon** to copy the link
5. Share the link with the user via email/message
6. Done! The user can now complete registration

### Reject a Request (Optional)

1. Click the **red X** button on a request
2. Enter a reason (optional)
3. Click **"Reject Request"**
4. The request status changes to "Rejected"

### Delete Old Requests

1. Click the **trash icon** on any request
2. Confirm deletion
3. Request is permanently removed

---

## 📊 Dashboard Overview

**Statistics Cards:**

- **Pending:** Awaiting approval
- **Approved:** Already approved
- **Rejected:** Rejected requests

**Tabs:**

- **Pending:** View requests needing action
- **Approved:** See approved requests
- **Rejected:** See rejected requests
- **All:** Complete list

---

## ⏱️ Important Notes

- Approval links expire after **7 days**
- Tokens are **single-use** (can't register twice with same link)
- Each email can only have **one pending request** at a time
- Emails are case-insensitive (john@example.com = JOHN@example.com)

---

## 🔧 Common Issues

### "Invalid or expired approval link"

→ **Solution:** Request a new approval from admin

### "This email is already registered"

→ **Solution:** Use the login page instead

### "A registration request is already pending"

→ **Solution:** Wait for admin to process existing request

---

## 📧 Email Integration (Optional - For Later)

To send automatic emails when approving/rejecting:

1. Configure email settings in `.env.local`
2. Integrate email service in API endpoints
3. See `REGISTRATION_APPROVAL_GUIDE.md` for details

---

## ✅ Quick Reference

| Action                | Page/Location                       |
| --------------------- | ----------------------------------- |
| Submit Request        | `/register`                         |
| Complete Registration | `/register/complete?token=...`      |
| View Requests (Admin) | Admin Panel → Registration Requests |
| Approve Request       | Green checkmark button              |
| Reject Request        | Red X button                        |
| Delete Request        | Trash icon                          |

---

## 🎯 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Registration Approval Flow                │
└─────────────────────────────────────────────────────────────┘

USER                          ADMIN                    SYSTEM
  │                             │                         │
  ├─► Submit Request            │                         │
  │   (Name, Email, Message)    │                         │
  │                             │                         │
  │                             ├─► View Request          │
  │                             │   Dashboard             │
  │                             │                         │
  │                             ├─► Click Approve         │
  │                             │                         │
  │                             │   ◄──── Generate Token ─┤
  │                             │   ◄──── Create Link ────┤
  │                             │                         │
  │   ◄─── Receive Link ────────┤                         │
  │   (via email/message)       │                         │
  │                             │                         │
  ├─► Click Link                │                         │
  │                             │                         │
  │                             │   ◄──── Verify Token ───┤
  │                             │                         │
  ├─► Set Password              │                         │
  │                             │                         │
  │                             │   ◄──── Create Account ─┤
  │                             │   ◄──── Generate JWT ───┤
  │                             │                         │
  ├─► Access Admin Panel ────────────────────────────────►│
  │   (Logged In)               │                         │
  │                             │                         │
```

---

**Need Help?** Refer to `REGISTRATION_APPROVAL_GUIDE.md` for detailed documentation.
