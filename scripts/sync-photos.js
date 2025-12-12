const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Load service account credentials from environment
function getGoogleDriveClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

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

    // First, check if there's an "All" folder (user's structure is: Root/All/2016/2016.001)
    const allFolderResult = await drive.files.list({
      q: `name='All' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    // Use "All" folder as parent if it exists, otherwise use root
    const parentFolderId = allFolderResult.data.files.length > 0
      ? allFolderResult.data.files[0].id
      : rootFolderId;

    // Find year folder
    const yearFolderResult = await drive.files.list({
      q: `name='${year}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!yearFolderResult.data.files.length) {
      return [];
    }

    const yearFolderId = yearFolderResult.data.files[0].id;

    // Find accession folder
    const accessionFolderResult = await drive.files.list({
      q: `name='${accessionNo}' and '${yearFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!accessionFolderResult.data.files.length) {
      return [];
    }

    const accessionFolderId = accessionFolderResult.data.files[0].id;

    // Get all image files in accession folder, sorted by name
    const filesResult = await drive.files.list({
      q: `'${accessionFolderId}' in parents and (mimeType contains 'image/jpeg' or mimeType contains 'image/png') and trashed=false`,
      fields: 'files(id, name)',
      orderBy: 'name',
    });

    // Use Google Drive thumbnail API (better CORS support)
    const photos = filesResult.data.files.map(file =>
      `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`
    );

    return photos;
  } catch (error) {
    console.error(`  ✗ Error getting photos for ${accessionNo}:`, error.message);
    return [];
  }
}

// Get box scan for a specific accession number from Box Scans/JPEG folder
async function getBoxScanForPuzzle(drive, rootFolderId, accessionNo) {
  try {
    // Find "Box Scans" folder
    const boxScansFolderResult = await drive.files.list({
      q: `name='Box Scans' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!boxScansFolderResult.data.files.length) {
      return null;
    }

    const boxScansFolderId = boxScansFolderResult.data.files[0].id;

    // Find "JPEG" folder inside Box Scans
    const jpegFolderResult = await drive.files.list({
      q: `name='JPEG' and '${boxScansFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (!jpegFolderResult.data.files.length) {
      return null;
    }

    const jpegFolderId = jpegFolderResult.data.files[0].id;

    // Look for file that starts with accession number (e.g., "2016.001.jpg" or "2016.001-something.jpg")
    const fileResult = await drive.files.list({
      q: `'${jpegFolderId}' in parents and name contains '${accessionNo}' and mimeType='image/jpeg' and trashed=false`,
      fields: 'files(id, name)',
      orderBy: 'name',
    });

    if (!fileResult.data.files.length) {
      return null;
    }

    // Return the first matching file using Google Drive thumbnail API
    return `https://drive.google.com/thumbnail?id=${fileResult.data.files[0].id}&sz=w2000`;
  } catch (error) {
    // Silently skip box scans that don't exist
    return null;
  }
}

// Main sync function
async function syncPhotos() {
  console.log('🔄 Starting photo sync from Google Drive...\n');

  const drive = await getGoogleDriveClient();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!rootFolderId) {
    console.error('❌ Error: GOOGLE_DRIVE_FOLDER_ID not found in environment variables');
    process.exit(1);
  }

  // Load puzzles data (to get list of puzzles and their hasPhoto flags)
  const puzzlesPath = path.join(__dirname, '../public/data/puzzles.json');
  let puzzles;

  try {
    puzzles = JSON.parse(await fs.readFile(puzzlesPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading puzzles.json:', error.message);
    console.error('   Make sure you run "npm run sync-data" first!');
    process.exit(1);
  }

  // Create images object to store all photo data separately
  const images = {};

  // Fetch photos for each puzzle that has photos
  let photosUpdated = 0;
  let photosNotFound = 0;
  let photosSkipped = 0;

  console.log(`📦 Processing ${puzzles.length} puzzles...\n`);

  for (const puzzle of puzzles) {
    if (puzzle.hasPhoto) {
      const photos = await getPhotosForPuzzle(drive, rootFolderId, puzzle.accessionNo);

      if (photos.length > 0) {
        images[puzzle.accessionNo] = {
          photos,
          photoCount: photos.length
        };
        photosUpdated++;
        console.log(`  ✓ ${puzzle.accessionNo}: ${photos.length} photo${photos.length > 1 ? 's' : ''}`);
      } else {
        photosNotFound++;
        console.log(`  ✗ ${puzzle.accessionNo}: No photos found in Drive`);
      }

      // Rate limiting - don't hammer the API
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      photosSkipped++;
    }
  }

  // Write images data to separate file
  const imagesPath = path.join(__dirname, '../public/data/puzzle-images.json');
  await fs.writeFile(imagesPath, JSON.stringify(images, null, 2));

  console.log(`\n✅ Photo sync complete!`);
  console.log(`   ${photosUpdated} puzzles updated with photos`);
  console.log(`   ${photosNotFound} puzzles marked with photos but not found in Drive`);
  console.log(`   ${photosSkipped} puzzles skipped (no photos expected)`);
  console.log(`\n💾 Updated: ${imagesPath}`);
}

// Run sync
syncPhotos().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
