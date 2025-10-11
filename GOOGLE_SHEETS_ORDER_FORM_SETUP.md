# Google Sheets Order Form Setup Guide

This guide will help you set up Google Sheets to receive order submissions from your shop page.

## 📋 Overview

When customers click "Order Now" on a product, they'll fill out a form with their details. This data will be automatically sent to your Google Sheet.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Shop Orders"** (or whatever you prefer)
4. In the first row, add these column headers:
   - `Timestamp`
   - `Product Name`
   - `Product Price`
   - `Customer Name`
   - `Customer Email`
   - `Customer Phone`
   - `Quantity`
   - `Shipping Address`
   - `Additional Notes`
   - `Order Status`

### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Prepare the row data
    var rowData = [
      new Date(), // Timestamp
      data.productName || "", // Product Name
      data.productPrice || "", // Product Price
      data.customerName || "", // Customer Name
      data.customerEmail || "", // Customer Email
      data.customerPhone || "", // Customer Phone
      data.quantity || 1, // Quantity
      data.shippingAddress || "", // Shipping Address
      data.additionalNotes || "", // Additional Notes
      "Pending", // Order Status (default)
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Order submitted successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Shop Order Form API is running",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. Click the **Save** icon (💾)
5. Name your project: **"Shop Order Form Handler"**

### Step 3: Deploy the Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description:** Shop Order Form
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Authorize** the script (click "Authorize access" and grant permissions)
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbxxx.../exec
   ```

### Step 4: Add the URL to Your Admin Panel

1. Log in to your admin panel
2. Go to **Shop Content Editor**
3. Find the new field: **"Google Sheets Form URL"**
4. Paste the Web App URL you copied
5. Click **Save Changes**

---

## ✅ Test Your Setup

1. Go to your shop page
2. Click **Order Now** on any product
3. Fill out the form
4. Click **Submit Order**
5. Check your Google Sheet - you should see a new row with the order data!

---

## 📊 Managing Orders

### View Orders

Your Google Sheet will now automatically receive all orders with:

- Timestamp of when the order was placed
- Product details (name and price)
- Customer information
- Shipping details
- Order status

### Update Order Status

In the "Order Status" column, you can manually update:

- **Pending** - New order (default)
- **Processing** - Order is being prepared
- **Shipped** - Order has been shipped
- **Completed** - Order delivered
- **Cancelled** - Order cancelled

### Additional Features

You can enhance your sheet with:

- **Conditional formatting** - Color code rows by status
- **Data validation** - Create dropdown for Order Status
- **Formulas** - Calculate total revenue: `=SUM(C:C)`
- **Charts** - Visualize orders over time
- **Filters** - Filter by date, product, or status
- **Email notifications** - Set up email alerts for new orders

---

## 🔧 Troubleshooting

### Orders Not Appearing in Sheet

1. **Check the Web App URL** - Make sure it ends with `/exec`
2. **Redeploy** - Go to Apps Script → Deploy → Manage deployments → Edit → Version: New version → Deploy
3. **Check permissions** - Make sure "Who has access" is set to "Anyone"

### "Authorization Required" Error

1. Go to Apps Script
2. Click **Run** → Select `doPost`
3. Click **Review permissions**
4. Click **Allow**

### Wrong Column Order

Make sure your sheet headers match exactly:

```
Timestamp | Product Name | Product Price | Customer Name | Customer Email | Customer Phone | Quantity | Shipping Address | Additional Notes | Order Status
```

---

## 🔒 Security Notes

- The Web App URL should be kept secure (don't share publicly)
- Only authorized users should have edit access to the Google Sheet
- Consider using Google Forms for even more security features
- You can restrict access by changing "Anyone" to "Anyone in your organization"

---

## 📧 Email Notifications (Optional)

To receive email notifications for new orders, add this to your Apps Script:

```javascript
function sendEmailNotification(orderData) {
  var email = "your-email@example.com"; // Change this to your email
  var subject = "New Order: " + orderData.productName;
  var body =
    "New order received!\n\n" +
    "Product: " +
    orderData.productName +
    "\n" +
    "Price: ₱" +
    orderData.productPrice +
    "\n" +
    "Customer: " +
    orderData.customerName +
    "\n" +
    "Email: " +
    orderData.customerEmail +
    "\n" +
    "Phone: " +
    orderData.customerPhone +
    "\n" +
    "Quantity: " +
    orderData.quantity +
    "\n" +
    "Address: " +
    orderData.shippingAddress +
    "\n" +
    "Notes: " +
    orderData.additionalNotes;

  MailApp.sendEmail(email, subject, body);
}
```

Then call it in your `doPost` function after appending the row:

```javascript
// After sheet.appendRow(rowData);
sendEmailNotification(data);
```

---

## 🎯 Next Steps

1. Customize the form fields in `shop.js` if needed
2. Add more columns to your sheet (e.g., Payment Method, Tracking Number)
3. Update the Apps Script to match your columns
4. Set up email notifications
5. Create dashboards and reports in Google Sheets

---

## 📱 Mobile Access

Your Google Sheet is accessible from:

- Google Sheets mobile app (iOS/Android)
- Any web browser
- Google Drive

You can manage orders from anywhere!

---

## 💡 Pro Tips

1. **Freeze the header row** - View → Freeze → 1 row
2. **Auto-resize columns** - Select all → Right-click column header → Resize columns
3. **Protect the sheet** - Data → Protect sheets and ranges
4. **Share with team** - Share button → Add people
5. **Create a dashboard** - Use pivot tables and charts for insights

---

## ❓ Need Help?

If you encounter issues:

1. Check the Apps Script logs: View → Logs
2. Test the URL in Postman or curl
3. Verify sheet permissions
4. Make sure the script is published as a web app
5. Check that the form URL is correctly saved in the admin panel

Enjoy your automated order management system! 🎉
