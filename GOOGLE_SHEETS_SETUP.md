# Google Sheets API Setup Guide

This guide walks you through setting up Google Sheets API access for your puzzle collection website.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Puzzle Collection Website")
5. Click "CREATE"

## Step 2: Enable Google Sheets API

1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and click "ENABLE"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "Service account"
3. Enter a name (e.g., "puzzle-collection-sync")
4. Click "CREATE AND CONTINUE"
5. Skip the optional steps and click "DONE"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on it to open details
3. Go to the "KEYS" tab
4. Click "ADD KEY" > "Create new key"
5. Choose "JSON" format
6. Click "CREATE" - a JSON file will download

## Step 5: Share Your Spreadsheet

1. Open your Google Sheet with the puzzle collection data
2. Click the "Share" button
3. Copy the service account email (looks like: `puzzle-collection-sync@your-project.iam.gserviceaccount.com`)
4. Paste it in the share dialog
5. Give it "Viewer" access
6. Click "Send"

## Step 6: Get Your Spreadsheet ID

Your spreadsheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

Copy everything between `/d/` and `/edit`

## Step 7: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in:

   ```
   # Your spreadsheet ID from Step 6
   REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here

   # The entire contents of the JSON file from Step 4 (as one line)
   GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

   # Your Dropbox photos URL (we'll set this up later)
   REACT_APP_DROPBOX_BASE_URL=
   ```

   **Important**: The `GOOGLE_SERVICE_ACCOUNT_KEY` should be the entire JSON file contents as a single line string.

## Step 8: Test the Sync

Run the sync script:
```bash
npm run sync-data
```

If successful, you should see:
```
✓ Successfully synced X puzzles to /public/data/puzzles.json
```

## Troubleshooting

### Error: "The caller does not have permission"
- Make sure you shared the spreadsheet with the service account email
- Check that the service account has at least "Viewer" access

### Error: "Unable to parse range"
- Open `scripts/sync-sheets.js`
- Adjust the `RANGE` variable to match your sheet name and column range
- Default is `Sheet1!A:AB` (columns A through AB)

### Error: "REACT_APP_SPREADSHEET_ID environment variable is not set"
- Make sure you created the `.env` file
- Check that the variable name is exactly `REACT_APP_SPREADSHEET_ID`
- Restart your development server after changing `.env`

## Sheet Structure

The script expects these column headers (must match exactly):
- Acc. No.
- Box
- Status
- Item
- Collection
- Series
- Sub-Series
- Producer
- Manufacturer
- Origin
- Year
- Item Color
- Sticker Type
- Color Scheme
- Size
- Weight
- Item Grade
- Box Grade
- Papers Grade
- Item Rarity
- Means of Acq.
- Medium
- Origin (Acq.)
- Sponsor
- Date
- Cost
- Photo
- Notes

If your column names are different, update the `FIELD_MAP` in `scripts/sync-sheets.js`.
