# Google Drive API Setup for Photo Hosting

## Overview
This guide walks through setting up Google Drive API to serve photos for the puzzle collection website. Photos will be dynamically fetched using the Google Drive API during the build process.

---

## Part 1: Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown → "New Project"
3. Project name: `puzzle-collection-photos`
4. Click "Create"

### Step 2: Enable Google Drive API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and click "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - **Service account name**: `puzzle-photos-sync`
   - **Service account ID**: (auto-generated)
   - **Description**: "Service account for syncing puzzle photos"
4. Click "Create and Continue"
5. **Grant this service account access to project**: Skip this (click "Continue")
6. Click "Done"

### Step 4: Create Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. **Important**: A JSON file will download - save it securely as `google-credentials.json`

### Step 5: Get the Service Account Email

From the JSON file you downloaded, note the `client_email` field:
```json
{
  "client_email": "puzzle-photos-sync@puzzle-collection-photos.iam.gserviceaccount.com",
  ...
}
```

You'll need this email to share your Google Drive folder.

---

## Part 2: Google Drive Setup

### Step 1: Organize Your Photos

Structure your photos folder like this:
```
Puzzle Collection Photos/
├── 2016/
│   ├── 2016.001/
│   │   ├── 2016.001-01.jpg
│   │   ├── 2016.001-02.jpg
│   │   ├── 2016.001-03.jpg
│   │   └── ...
│   └── 2016.002/
│       └── ...
└── 2017/
    └── ...
```

### Step 2: Share Folder with Service Account

1. Right-click your root photos folder ("Puzzle Collection Photos")
2. Click "Share"
3. Enter the service account email from Step 5 above
4. Set permission to **Viewer**
5. Uncheck "Notify people"
6. Click "Share"

### Step 3: Get Folder ID

1. Open the root photos folder in Google Drive
2. Look at the URL in your browser:
   ```
   https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          This is your Folder ID
   ```
3. Copy the Folder ID (the string after `/folders/`)

---

## Part 3: Local Development Setup

### Step 1: Install Dependencies

```bash
cd /Users/nate/Sites/puzzle-collection
npm install googleapis dotenv
```

### Step 2: Store Credentials Securely

1. Move the `google-credentials.json` file to your project root
2. Add it to `.gitignore`:

```bash
echo "google-credentials.json" >> .gitignore
```

3. Create a `.env` file in your project root:

```env
GOOGLE_DRIVE_FOLDER_ID=1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P
GOOGLE_SERVICE_ACCOUNT_FILE=./google-credentials.json
```

4. Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## Part 4: Implementation

### Create Photo Sync Script

Create `scripts/sync-photos.js`:

```javascript
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Load service account credentials
async function getGoogleDriveClient() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  const credentials = JSON.parse(await fs.readFile(keyFile, 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

// Get all photos for a specific accession number
async function getPhotosForPuzzle(drive, rootFolderId, accessionNo) {
  try {
    const year = accessionNo.split('.')[0];

    // Find year folder
    const yearFolderResult = await drive.files.list({
      q: `name='${year}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    if (!yearFolderResult.data.files.length) {
      console.log(`Year folder ${year} not found`);
      return [];
    }

    const yearFolderId = yearFolderResult.data.files[0].id;

    // Find accession folder
    const accessionFolderResult = await drive.files.list({
      q: `name='${accessionNo}' and '${yearFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    if (!accessionFolderResult.data.files.length) {
      console.log(`Accession folder ${accessionNo} not found`);
      return [];
    }

    const accessionFolderId = accessionFolderResult.data.files[0].id;

    // Get all image files in accession folder
    const filesResult = await drive.files.list({
      q: `'${accessionFolderId}' in parents and (mimeType contains 'image/jpeg' or mimeType contains 'image/png')`,
      fields: 'files(id, name, webContentLink, webViewLink)',
      orderBy: 'name',
    });

    // Generate direct view URLs
    const photos = filesResult.data.files.map(file => ({
      id: file.id,
      name: file.name,
      // Use direct view URL that doesn't expire
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,
    }));

    return photos;
  } catch (error) {
    console.error(`Error getting photos for ${accessionNo}:`, error.message);
    return [];
  }
}

// Main sync function
async function syncPhotos() {
  console.log('Starting photo sync...');

  const drive = await getGoogleDriveClient();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // Load puzzles data
  const puzzlesPath = path.join(__dirname, '../public/data/puzzles.json');
  const puzzles = JSON.parse(await fs.readFile(puzzlesPath, 'utf8'));

  console.log(`Processing ${puzzles.length} puzzles...`);

  // Fetch photos for each puzzle
  let updated = 0;
  for (const puzzle of puzzles) {
    if (puzzle.hasPhoto) {
      const photos = await getPhotosForPuzzle(drive, rootFolderId, puzzle.accessionNo);

      if (photos.length > 0) {
        puzzle.photos = photos.map(p => p.url);
        puzzle.photoCount = photos.length;
        updated++;
        console.log(`✓ ${puzzle.accessionNo}: ${photos.length} photos`);
      } else {
        console.log(`✗ ${puzzle.accessionNo}: No photos found`);
      }
    }

    // Rate limiting - don't hammer the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Write updated data back
  await fs.writeFile(puzzlesPath, JSON.stringify(puzzles, null, 2));

  console.log(`\nPhoto sync complete!`);
  console.log(`Updated ${updated} puzzles with photos`);
}

// Run sync
syncPhotos().catch(console.error);
```

### Update package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "sync-data": "node scripts/sync-sheets.js",
    "sync-photos": "node scripts/sync-photos.js",
    "prebuild": "npm run sync-data && npm run sync-photos",
    "build": "react-scripts build"
  }
}
```

---

## Part 5: GitHub Actions Setup (For Deployment)

### Create GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

**GOOGLE_CREDENTIALS**:
- Name: `GOOGLE_CREDENTIALS`
- Value: Paste the entire contents of your `google-credentials.json` file

**GOOGLE_DRIVE_FOLDER_ID**:
- Name: `GOOGLE_DRIVE_FOLDER_ID`
- Value: Your folder ID from Part 2, Step 3

### Update GitHub Actions Workflow

Create/update `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Google Drive credentials
        run: |
          echo '${{ secrets.GOOGLE_CREDENTIALS }}' > google-credentials.json
          echo "GOOGLE_DRIVE_FOLDER_ID=${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}" >> .env
          echo "GOOGLE_SERVICE_ACCOUNT_FILE=./google-credentials.json" >> .env

      - run: npm ci

      - name: Sync data and photos
        run: |
          npm run sync-data
          npm run sync-photos

      - run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Part 6: Testing

### Test Locally

1. Make sure your `.env` file is configured
2. Make sure `google-credentials.json` is in place
3. Run the photo sync:

```bash
npm run sync-photos
```

4. Check `public/data/puzzles.json` - each puzzle should now have a `photos` array with Google Drive URLs

5. Start the dev server:

```bash
npm start
```

6. Navigate to a puzzle detail page and verify photos load

---

## Troubleshooting

### "Permission denied" error
- Make sure you shared the Google Drive folder with the service account email
- Double-check the folder ID is correct

### "Folder not found" error
- Verify your folder structure matches: `Year/AccessionNo/photos`
- Check folder names are exact (case-sensitive)

### Photos not loading in browser
- Check browser console for CORS errors
- Google Drive should handle CORS automatically for `uc?export=view` URLs
- Try opening the URL directly in a new tab to verify it works

### Rate limiting
- The script includes 100ms delays between requests
- If you have 200+ puzzles, consider increasing the delay
- Google Drive API has a quota of 1,000 requests per 100 seconds

---

## Cost

✅ **Completely free!**
- Google Drive API: Free tier includes 1 billion queries per day
- Storage: Your existing Google Drive storage
- Bandwidth: Unlimited for public viewing

---

## Advantages Over Dropbox

✅ No link expiration
✅ Direct image URLs work in `<img>` tags
✅ Programmatic access via API
✅ Easy to add/update photos (just upload to Drive)
✅ Automatic sync during build process
✅ Free unlimited bandwidth

---

*Setup complete! Photos will now sync automatically during the build process.*
