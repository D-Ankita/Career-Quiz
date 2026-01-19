# 📊 How to Receive Quiz Results in Google Sheets

This guide will help you set up automatic result collection in a Google Sheet. Every time someone completes the quiz, their results (including full answers) will appear in your spreadsheet!

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Career Quiz Responses"
4. Create **TWO sheets/tabs**:
   - Sheet 1: "Main Quiz" (for the 40-question quiz)
   - Sheet 2: "Deep Dive" (for the follow-up quiz)

### Headers for Sheet 1: "Main Quiz"
In row 1, paste these headers:

```
Timestamp | Student Name | Education Level | Current Stream | Degree Type | Top Track 1 | Top Track 1 % | Top Track 2 | Top Track 2 % | Top Track 3 | Top Track 3 % | Stream Recommendation | JEE Recommendation | Routine Tolerance | Stress Tolerance | Clarity | Confidence | Risk Flags | Automotive Interest | Coding Addon | Full Results JSON | Answers JSON
```

### Headers for Sheet 2: "Deep Dive"
In row 1, paste these headers:

```
Timestamp | Student Name | Report ID | Commerce Score | Engineering Score | Auto Business Score | Auto Engineering Score | Stress Flags | Clarity | Passion | Primary Path | Full Answers JSON | Full Results JSON
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
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = e.parameter;
    
    // Determine which type of submission this is
    var quizType = data.type || 'main_quiz';
    
    if (quizType === 'deep_dive') {
      // Deep Dive Quiz Submission
      var sheet = ss.getSheetByName('Deep Dive');
      if (!sheet) {
        sheet = ss.insertSheet('Deep Dive');
        sheet.appendRow([
          'Timestamp', 'Student Name', 'Report ID', 'Commerce Score', 'Engineering Score',
          'Auto Business Score', 'Auto Engineering Score', 'Stress Flags', 'Clarity', 
          'Passion', 'Primary Path', 'Full Answers JSON', 'Full Results JSON'
        ]);
      }
      
      var row = [
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.studentName || '',
        data.reportId || '',
        data.commerceScore || 0,
        data.engineeringScore || 0,
        data.automotiveBusinessScore || 0,
        data.automotiveEngineeringScore || 0,
        data.stressFlags || 0,
        data.clarityScore || 0,
        data.passionScore || 0,
        data.primaryPath || '',
        data.fullAnswersJSON || '',
        data.fullResultsJSON || ''
      ];
      
      sheet.appendRow(row);
      
    } else {
      // Main Quiz Submission
      var sheet = ss.getSheetByName('Main Quiz');
      if (!sheet) {
        sheet = ss.getSheets()[0]; // Use first sheet if Main Quiz doesn't exist
      }
      
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
        data.fullResultsJSON || '',
        data.answersJSON || ''
      ];
      
      sheet.appendRow(row);
    }
    
    // Return success response
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
   - **Description:** Career Quiz Webhook v2 (with full answers)
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

## Step 4: Add URL to Vercel Environment Variables

Since you're using Vercel:

1. Go to https://vercel.com
2. Select your project (career-quiz)
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `NEXT_PUBLIC_WEBHOOK_URL`
   - **Value:** Your Google Apps Script URL from Step 3
5. Click **Save**
6. **Redeploy** your project for changes to take effect

---

## Step 5: Test It!

1. Open your quiz: https://career-quiz-ten.vercel.app
2. Complete a quiz OR the deep dive quiz
3. Check your Google Sheet - data should appear in the correct sheet!

---

## 🔧 Troubleshooting

### "Webhook URL not configured" error
- Make sure the environment variable is set in Vercel
- Redeploy after adding the variable

### Data not appearing in sheet
1. Open your Apps Script (Extensions → Apps Script)
2. Go to **Executions** in the left sidebar
3. Check for any errors

### "Bad Request 400" error
- Make sure you deployed as "Anyone" can access
- Try redeploying: Deploy → Manage deployments → Edit → Deploy new version

### Updating the Script
When you update the Apps Script code:
1. Go to Deploy → Manage deployments
2. Click the ✏️ edit button
3. Select "New version" from dropdown
4. Click Deploy
5. **No need to change the URL** - it stays the same!

---

## 📋 What Gets Saved

### Main Quiz (40 questions)
- Student profile (name, education, stream)
- Top 3 career tracks with percentages
- Stream & JEE recommendations
- All meter scores (routine, stress, clarity, confidence)
- Risk flags
- **Full answers JSON** (every answer to every question)
- **Full results JSON** (complete analysis)

### Deep Dive Quiz (25 questions)
- Student name & report ID
- Commerce vs Engineering scores
- Automotive Business vs Engineering scores
- Stress, Clarity, Passion scores
- Primary path recommendation
- **All answers** (including custom text answers)
- **Full results JSON**

---

## 📊 Example Data

Your sheets will contain rich data like:

**Main Quiz - Answers JSON:**
```json
{
  "q1": "c",
  "q2": ["e", "d"],
  "q3": "c",
  ...
}
```

**Deep Dive - Full Answers JSON:**
```json
{
  "dd1": "📺 Watch YouTube about business/money/startups",
  "dd2": "[CUSTOM] I like researching car prices and comparing deals",
  ...
}
```

This gives you complete visibility into how each student answered!
