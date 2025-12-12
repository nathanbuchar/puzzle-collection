// Load environment variables from .env file
require('dotenv').config();

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const RANGE = 'A:AB'; // Will use the first sheet automatically
const OUTPUT_PATH = path.join(__dirname, '../public/data/puzzles.json');

// Field mapping from CSV columns to JSON properties
const FIELD_MAP = {
  'Acc. No.': 'accessionNo',
  'Box': 'box',
  'Status': 'status',
  'Item': 'item',
  'Collection': 'collection',
  'Series': 'series',
  'Sub-Series': 'subSeries',
  'Producer': 'producer',
  'Manufacturer': 'manufacturer',
  'Origin': 'origin',
  'Year': 'year',
  'Item Color': 'itemColor',
  'Item Sticker Type': 'stickerType',
  'Item Sticker Color Scheme': 'colorScheme',
  'Item Size': 'size',
  'Item Weight': 'weight',
  'Item Grade': 'itemGrade',
  'Box Grade': 'boxGrade',
  'Papers Grade': 'papersGrade',
  'Item Rarity': 'rarity',
  'Means of Acquisition': 'acquisitionMeans',
  'Acquisition Medium': 'acquisitionMedium',
  'Acquisition Origin': 'acquisitionOrigin',
  'Acquisition Sponsor': 'acquisitionSponsor',
  'Accession Date': 'acquisitionDate',
  'Cost': 'acquisitionCost',
  'Photo': 'hasPhoto',
  'Notes': 'notes'
};

async function fetchSheetData() {
  try {
    console.log('Fetching data from Google Sheets...');

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    console.log(`Fetched ${rows.length} rows from spreadsheet.`);

    // Parse data
    const headers = rows[0];
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const puzzle = {};

      headers.forEach((header, index) => {
        const fieldName = FIELD_MAP[header] || header;
        const value = row[index] || '';
        puzzle[fieldName] = value;
      });

      data.push(puzzle);
    }

    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

function transformPuzzleData(rawData, photoMap) {
  console.log(`Transforming ${rawData.length} puzzles...`);

  // Filter to only include Cube Puzzles collection
  const cubePuzzles = rawData.filter(puzzle => puzzle.collection === 'Cube Puzzles');
  console.log(`Filtered to ${cubePuzzles.length} Cube Puzzles (excluded ${rawData.length - cubePuzzles.length} non-cube puzzles)`);

  return cubePuzzles.map(puzzle => {
    // Create slug for URL
    const slug = `${puzzle.accessionNo}-${puzzle.item}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Structure acquisition data
    const acquisition = {
      means: puzzle.acquisitionMeans || '',
      medium: puzzle.acquisitionMedium || '',
      origin: puzzle.acquisitionOrigin || '',
      date: puzzle.acquisitionDate || '',
      cost: getCostRange(puzzle.acquisitionCost) // Convert to range
    };

    // Add enriched data from constants
    const statusInfo = getStatusInfo(puzzle.status);
    const gradeInfo = getGradeInfo(puzzle.itemGrade, 'item');
    const boxGradeInfo = getGradeInfo(puzzle.boxGrade, 'box');
    const papersGradeInfo = getGradeInfo(puzzle.papersGrade, 'papers');
    const rarityInfo = getRarityInfo(puzzle.rarity);

    // NOTE: Photos are now managed separately via sync-photos.js -> puzzle-images.json

    return {
      accessionNo: puzzle.accessionNo,
      box: puzzle.box,
      status: puzzle.status,
      statusLabel: statusInfo.label,
      statusDescription: statusInfo.description,
      item: puzzle.item,
      collection: puzzle.collection,
      series: puzzle.series,
      subSeries: puzzle.subSeries,
      producer: puzzle.producer,
      manufacturer: puzzle.manufacturer,
      origin: puzzle.origin,
      year: puzzle.year,
      itemColor: puzzle.itemColor,
      stickerType: puzzle.stickerType,
      colorScheme: puzzle.colorScheme,
      size: puzzle.size,
      weight: puzzle.weight,
      itemGrade: puzzle.itemGrade,
      itemGradeLabel: gradeInfo.label,
      itemGradeDescription: gradeInfo.description,
      boxGrade: puzzle.boxGrade,
      boxGradeLabel: boxGradeInfo.label,
      boxGradeDescription: boxGradeInfo.description,
      papersGrade: puzzle.papersGrade,
      papersGradeLabel: papersGradeInfo.label,
      papersGradeDescription: papersGradeInfo.description,
      rarity: puzzle.rarity,
      rarityLabel: rarityInfo.label,
      rarityDescription: rarityInfo.description,
      acquisition,
      hasPhoto: puzzle.hasPhoto === 'TRUE' || puzzle.hasPhoto === '1',
      notes: puzzle.notes,
      slug
    };
  });
}

// Helper functions for enrichment
function getStatusInfo(status) {
  const statusMap = {
    'A': { label: 'Accessioned', description: 'Active in collection' },
    'L': { label: 'On Loan', description: 'Currently on loan' },
    'M': { label: 'Missing', description: 'Item is missing' },
    'X': { label: 'Deaccessioned', description: 'Removed from collection' },
    'XE': { label: 'Exchanged', description: 'Exchanged with another institution' },
    'XD': { label: 'Donated', description: 'Donated to another institution' },
    'XS': { label: 'Sold', description: 'Sold' }
  };
  return statusMap[status] || { label: status, description: '' };
}

function getGradeInfo(grade) {
  const gradeMap = {
    'M': { label: 'Mint', description: 'Never-used and in perfect condition' },
    'NM': { label: 'Near Mint', description: 'Possibly used but must appear to be new' },
    'EX': { label: 'Excellent', description: 'Used, but barely with very minor signs of wear' },
    'VG': { label: 'Very Good', description: 'Looks very good but has minor blemishes' },
    'G': { label: 'Good', description: 'Looks used with defects' },
    'F': { label: 'Fair', description: 'Looks significantly used with serious defects' },
    'P': { label: 'Poor', description: 'Barely collectible, severe damage' },
    'U': { label: 'Unknown', description: 'Component condition is unknown' },
    'X': { label: 'Missing', description: 'Component is missing' }
  };
  return gradeMap[grade] || { label: '', description: '' };
}

function getRarityInfo(rarity) {
  const rarityMap = {
    'R1': { label: 'Common', description: 'Easy to find' },
    'R2': { label: 'Less common', description: 'Somewhat difficult to find' },
    'R3': { label: 'Scarce', description: 'Difficult to find' },
    'R4': { label: 'Rare', description: 'Very difficult to find' },
    'R5': { label: 'Very rare', description: 'Almost impossible to find' },
    'R6': { label: 'Unique', description: 'Unique, or nearly so' }
  };
  return rarityMap[rarity] || { label: rarity, description: '' };
}

function getCostRange(costString) {
  if (!costString || costString.trim() === '') {
    return '';
  }

  // Extract numeric value from cost string (e.g., "$199.99" -> 199.99)
  const numericValue = parseFloat(costString.replace(/[^0-9.]/g, ''));

  if (isNaN(numericValue)) {
    return costString; // Return original if we can't parse it
  }

  // Categorize into ranges
  if (numericValue <= 100) {
    return '$0-100';
  } else if (numericValue <= 500) {
    return '$100-500';
  } else {
    return '$500+';
  }
}

// Load cached photo data
function loadCachedPhotos() {
  const PHOTO_CACHE_PATH = path.join(__dirname, '../public/data/photo-cache.json');

  try {
    if (fs.existsSync(PHOTO_CACHE_PATH)) {
      const cachedData = fs.readFileSync(PHOTO_CACHE_PATH, 'utf8');
      const photoMap = JSON.parse(cachedData);
      console.log(`Loaded cached photos for ${Object.keys(photoMap).length} puzzles`);
      return photoMap;
    } else {
      console.log('⚠️  No photo cache found. Run "npm run sync-photos" to create it.');
      return {};
    }
  } catch (error) {
    console.error('Error loading photo cache:', error.message);
    return {};
  }
}

function generatePhotoUrls(accessionNo, photoMap) {
  // If we have actual photos from Dropbox, use those
  if (photoMap && photoMap[accessionNo]) {
    return photoMap[accessionNo]
      .sort((a, b) => a.filename.localeCompare(b.filename))
      .map(photo => photo.url);
  }

  // Otherwise return empty array
  return [];
}

async function main() {
  try {
    console.log('Starting Google Sheets sync...\n');

    // Check for required environment variables
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SPREADSHEET_ID environment variable is not set');
    }

    // Fetch data from Google Sheets
    const rawData = await fetchSheetData();

    // Transform data (photos are managed separately via sync-photos.js)
    const transformedData = transformPuzzleData(rawData, {});

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(transformedData, null, 2));

    console.log(`\n✓ Successfully synced ${transformedData.length} puzzles to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('\n✗ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchSheetData, loadCachedPhotos, transformPuzzleData };
