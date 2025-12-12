import { STATUS_MAP, GRADE_MAP, RARITY_MAP, DROPBOX_BASE_URL } from './constants';

/**
 * Generate photo URLs for a puzzle based on its accession number
 * Photos are organized as: year/accession/accession-01.jpg through accession-20.jpg
 */
export function generatePhotoUrls(accessionNo, maxPhotos = 20) {
  if (!DROPBOX_BASE_URL) {
    return [];
  }

  const year = accessionNo.split('.')[0]; // "2016.001" -> "2016"
  const photos = [];

  for (let i = 1; i <= maxPhotos; i++) {
    const num = String(i).padStart(2, '0'); // "01", "02", etc.
    photos.push(`${DROPBOX_BASE_URL}/${year}/${accessionNo}/${accessionNo}-${num}.jpg`);
  }

  return photos;
}

/**
 * Create a URL-friendly slug from an accession number and item name
 */
export function createSlug(accessionNo, itemName) {
  // Start with accession number
  const slug = `${accessionNo}-${itemName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens

  return slug;
}

/**
 * Enrich a raw puzzle object with label and description fields
 * from the reference data maps
 */
export function enrichPuzzleData(rawPuzzle) {
  // Status enrichment
  const statusInfo = STATUS_MAP[rawPuzzle.Status] || {};

  // Grade enrichments
  const itemGradeInfo = GRADE_MAP[rawPuzzle['Item Grade']] || {};
  const boxGradeInfo = GRADE_MAP[rawPuzzle['Box Grade']] || {};
  const papersGradeInfo = GRADE_MAP[rawPuzzle['Papers Grade']] || {};

  // Rarity enrichment
  const rarityInfo = RARITY_MAP[rawPuzzle['Item Rarity']] || {};

  // Generate photos
  const photos = rawPuzzle.Photo === 'TRUE'
    ? generatePhotoUrls(rawPuzzle['Acc. No.'])
    : [];

  // Create slug
  const slug = createSlug(rawPuzzle['Acc. No.'], rawPuzzle.Item);

  return {
    // Core identity fields
    accessionNo: rawPuzzle['Acc. No.'],
    box: rawPuzzle.Box,
    item: rawPuzzle.Item,
    collection: rawPuzzle.Collection,
    series: rawPuzzle.Series,
    subSeries: rawPuzzle['Sub-Series'],

    // Status with enrichment
    status: rawPuzzle.Status,
    statusLabel: statusInfo.label || rawPuzzle.Status,
    statusDescription: statusInfo.description || '',

    // Production info
    producer: rawPuzzle.Producer,
    manufacturer: rawPuzzle.Manufacturer,
    origin: rawPuzzle.Origin,
    year: rawPuzzle.Year,

    // Physical properties
    itemColor: rawPuzzle['Item Color'],
    stickerType: rawPuzzle['Item Sticker Type'],
    colorScheme: rawPuzzle['Item Sticker Color Scheme'],
    size: rawPuzzle['Item Size'],
    weight: rawPuzzle['Item Weight'],

    // Condition grades with enrichment
    itemGrade: rawPuzzle['Item Grade'],
    itemGradeLabel: itemGradeInfo.label || '',
    itemGradeDescription: itemGradeInfo.description || '',

    boxGrade: rawPuzzle['Box Grade'],
    boxGradeLabel: boxGradeInfo.label || '',
    boxGradeDescription: boxGradeInfo.description || '',

    papersGrade: rawPuzzle['Papers Grade'],
    papersGradeLabel: papersGradeInfo.label || '',
    papersGradeDescription: papersGradeInfo.description || '',

    // Rarity with enrichment
    rarity: rawPuzzle['Item Rarity'],
    rarityLabel: rarityInfo.label || '',
    rarityDescription: rarityInfo.description || '',

    // Provenance
    acquisition: {
      means: rawPuzzle['Means of Acquisition'],
      medium: rawPuzzle['Acquisition Medium'],
      origin: rawPuzzle['Acquisition Origin'],
      sponsor: rawPuzzle['Acquisition Sponsor'],
      date: rawPuzzle['Accession Date'],
      cost: rawPuzzle.Cost
    },

    // Media and notes
    hasPhoto: rawPuzzle.Photo === 'TRUE',
    photos,
    notes: rawPuzzle.Notes,

    // Derived fields
    slug
  };
}

/**
 * Transform array of raw CSV data to enriched puzzle objects
 */
export function transformPuzzleData(rawData) {
  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData
    .map(enrichPuzzleData)
    .filter(puzzle => puzzle.status === 'A'); // Only show active items by default
}
