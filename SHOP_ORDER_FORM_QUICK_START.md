# Shop Order Form - Quick Start Guide

Your shop now has an integrated order form that sends data directly to Google Sheets! 🎉

## ✅ What's New

- **Order Form**: Customers can now fill out a form with their information when clicking "Order Now"
- **Google Sheets Integration**: All order submissions are automatically saved to your Google Sheet
- **Form Fields**:
  - Customer Name (required)
  - Email Address (required)
  - Phone Number (required)
  - Quantity (with automatic total calculation)
  - Shipping Address
  - Additional Notes

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Google Sheet & Script (5 minutes)

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet
2. Add these column headers in row 1:
   ```
   Timestamp | Product Name | Product Price | Customer Name | Customer Email | Customer Phone | Quantity | Shipping Address | Additional Notes | Order Status
   ```
3. Go to **Extensions** → **Apps Script**
4. Copy the script from `GOOGLE_SHEETS_ORDER_FORM_SETUP.md` (lines 22-66)
5. Save and click **Deploy** → **New deployment** → **Web app**
6. Set "Who has access" to **Anyone**
7. Copy the Web App URL (ends with `/exec`)

### Step 2: Configure Admin Panel (1 minute)

1. Log in to your admin panel
2. Go to **Shop Content Editor**
3. Scroll to "Order Information" section
4. Paste your Web App URL in the **Google Sheets Form URL** field
5. Click **Save Changes**

### Step 3: Test It! (1 minute)

1. Go to your shop page
2. Click **Order Now** on any product
3. Fill out the form
4. Click **Submit Order**
5. Check your Google Sheet - you should see the order! ✨

## 📋 Order Form Features

### Customer View

When customers click "Order Now", they'll see:

- Product image and price
- Form to fill out their information
- Automatic total calculation based on quantity
- Your contact information for questions
- Clear submission feedback

### Admin View (Google Sheets)

You'll receive:

- Timestamp of order
- Product details (name and price)
- Customer information (name, email, phone)
- Order quantity and total
- Shipping address
- Any additional notes
- Status column (default: "Pending")

## 💡 Managing Orders

### Update Order Status

In your Google Sheet, update the "Order Status" column:

- **Pending** - New order
- **Processing** - Preparing order
- **Shipped** - Order sent
- **Completed** - Order delivered
- **Cancelled** - Order cancelled

### Best Practices

1. **Check orders daily** - Keep your Google Sheet open or enable email notifications
2. **Respond quickly** - Contact customers within 24 hours
3. **Update status** - Keep customers informed by updating the order status
4. **Archive old orders** - Move completed orders to a separate sheet monthly

## 🔧 Customization Options

### Add More Form Fields

Edit `src/components/Shop-sections/shop.js` to add custom fields like:

- Payment method preference
- Delivery date request
- Gift wrapping option
- Special instructions

### Email Notifications

Add email notifications to your Google Apps Script:

```javascript
function sendEmailNotification(orderData) {
  var email = "your-email@example.com";
  var subject = "New Order: " + orderData.productName;
  var body =
    "New order received!\n\n" +
    "Product: " +
    orderData.productName +
    "\n" +
    "Customer: " +
    orderData.customerName +
    "\n" +
    "Email: " +
    orderData.customerEmail;

  MailApp.sendEmail(email, subject, body);
}
```

See full guide in `GOOGLE_SHEETS_ORDER_FORM_SETUP.md`

## 🎨 Form Appearance

The order form automatically adapts to your site's theme:

- Light/dark mode support
- Responsive design (mobile-friendly)
- Professional layout
- Clear validation messages

## ❓ Troubleshooting

### Orders not appearing in sheet

1. Check that the Google Sheets URL ends with `/exec`
2. Make sure "Who has access" is set to "Anyone"
3. Try redeploying: Apps Script → Deploy → Manage deployments → Edit → New version

### Form submission error

1. Verify the URL is saved in the admin panel
2. Check that the Google Apps Script is published as a web app
3. Test the URL directly in your browser

### No email validation

The form includes automatic email validation. If customers can't submit:

- Make sure they're using a valid email format (user@domain.com)
- Check that all required fields are filled

## 📊 Next Steps

1. **Test the form** with real data
2. **Share the shop** with your team
3. **Set up email notifications** (optional)
4. **Create order reports** in Google Sheets
5. **Train staff** on managing orders

## 🎯 Pro Tips

- **Freeze the header row** in Google Sheets for easier scrolling
- **Use conditional formatting** to highlight urgent orders
- **Create a dashboard** with charts showing order trends
- **Export monthly** for accounting records
- **Share the sheet** with relevant team members

## 📱 Mobile Management

Your Google Sheet is accessible from:

- Google Sheets mobile app
- Any web browser
- Easy to manage orders on the go!

## 🌟 Benefits

✅ No payment processing fees (orders are just inquiries)  
✅ No additional software needed  
✅ Free and unlimited submissions  
✅ Easy to customize  
✅ All data in one place  
✅ Works with your existing workflow

---

**Need detailed setup instructions?**  
See: `GOOGLE_SHEETS_ORDER_FORM_SETUP.md`

**Having issues?**  
Check the troubleshooting section in the detailed guide.

Enjoy your automated order management system! 🚀
