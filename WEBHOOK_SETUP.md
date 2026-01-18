# 📊 How to Receive Quiz Results in Google Sheets

This guide will help you set up automatic result collection in a Google Sheet. Every time someone completes the quiz and clicks "Submit for Review", their results will appear in your spreadsheet!

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Career Quiz Responses"
4. In row 1, paste these headers (copy the line below and paste in cell A1):

```
Timestamp	Student Name	Education Level	Current Stream	Degree Type	Top Track 1	Top Track 1 %	Top Track 2	Top Track 2 %	Top Track 3	Top Track 3 %	Stream Recommendation	JEE Recommendation	Routine Tolerance	Stress Tolerance	Clarity	Confidence	Risk Flags	Automotive Interest	Coding Addon	Parent Email	Parent Phone
```

---

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. **Copy and paste this ENTIRE code:**

```javascript
// Handle POST requests from the quiz
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse form data (URL-encoded)
    var data = e.parameter;
    
    // Create row with data
    var row = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.studentName || '',
      data.educationLevel || '',
      data.currentStream || '',
      data.degreeType || '',
      data.topTrack1 || '',
      data.topTrack1Percentage || 0,
      data.topTrack2 || '',
      data.topTrack2Percentage || 0,
      data.topTrack3 || '',
      data.topTrack3Percentage || 0,
      data.streamRecommendation || '',
      data.jeeRecommendation || '',
      data.routineTolerance || 0,
      data.stressTolerance || 0,
      data.clarity || 0,
      data.confidence || 0,
      data.riskFlags || '',
      data.automotiveInterest === 'true' ? 'Yes' : 'No',
      data.codingAddon === 'true' ? 'Yes' : 'No',
      data.parentEmail || '',
      data.parentPhone || ''
    ];
    
    // Append to sheet
    sheet.appendRow(row);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data received!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing in browser)
function doGet(e) {
  return ContentService
    .createTextOutput("✅ Career Quiz Webhook is active! Waiting for submissions...")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Click the **Save** button (💾 icon)
5. Name the project "Career Quiz Webhook"

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the ⚙️ gear icon next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** Career Quiz Webhook v1
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** ⚠️ (This is important!)
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Career Quiz Webhook (unsafe)**
9. Click **Allow**
10. **COPY THE WEB APP URL** - it looks like:
    ```
    https://script.google.com/macros/s/AKfycbw...something.../exec
    ```

---

## Step 4: Add URL to Your Quiz App

1. In your project folder, create a file named `.env.local`
2. Add this line (replace with YOUR URL from Step 3):

```
NEXT_PUBLIC_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

3. **Restart the dev server:**
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

---

## Step 5: Test It!

1. Open your quiz: http://localhost:3000
2. Complete a quiz
3. On the results page, click **"Submit for Review"**
4. Check your Google Sheet - the data should appear!

---

## 🔧 Troubleshooting

### "Webhook URL not configured" error
- Make sure `.env.local` file exists in the project root
- Make sure the URL starts with `https://script.google.com/`
- Restart the dev server after adding the env file

### Data not appearing in sheet
1. Open your Apps Script (Extensions → Apps Script)
2. Go to **Executions** in the left sidebar
3. Check for any errors

### "Bad Request 400" error
- Make sure you deployed as "Anyone" can access
- Try redeploying: Deploy → Manage deployments → Edit → Deploy new version

### Still not working?
Test your webhook by visiting the URL directly in browser - you should see:
```
✅ Career Quiz Webhook is active! Waiting for submissions...
```

---

## 📧 Optional: Get Email Notifications

Add this inside the `doPost` function, after `sheet.appendRow(row);`:

```javascript
// Send email notification
MailApp.sendEmail({
  to: "YOUR_EMAIL@gmail.com",  // ← Change this!
  subject: "🎯 New Quiz: " + data.studentName,
  body: "New submission!\n\n" +
        "Student: " + data.studentName + "\n" +
        "Education: " + data.educationLevel + "\n" +
        "Top Track: " + data.topTrack1 + " (" + data.topTrack1Percentage + "%)\n" +
        "Stream: " + data.streamRecommendation + "\n" +
        "JEE: " + data.jeeRecommendation + "\n\n" +
        "Contact: " + (data.parentEmail || data.parentPhone || "Not provided") + "\n\n" +
        "View full results in your Google Sheet."
});
```

After adding this, click **Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy**

---

## 📱 Quick Reference

| What | Where |
|------|-------|
| Google Sheet | Your responses appear here |
| Apps Script | Extensions → Apps Script |
| Webhook URL | Deploy → Manage deployments |
| Environment | `.env.local` in project folder |

---

Happy counseling! 🎓
