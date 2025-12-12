// Reference data dictionaries for puzzle collection
// Based on museum cataloging standards

export const STATUS_MAP = {
  'A': { label: 'Accessioned', description: 'Active in collection' },
  'L': { label: 'On Loan', description: 'Currently on loan' },
  'M': { label: 'Missing', description: 'Item is missing' },
  'X': { label: 'Deaccessioned', description: 'Removed from collection' },
  'XE': { label: 'Exchanged', description: 'Exchanged with another institution' },
  'XD': { label: 'Donated', description: 'Donated to another institution' },
  'XS': { label: 'Sold', description: 'Sold' }
};

export const GRADE_MAP = {
  'M': { label: 'Mint', description: 'Never-used and in perfect condition' },
  'NM': { label: 'Near Mint', description: 'Possibly used but must appear to be new' },
  'EX': { label: 'Excellent', description: 'Used, but barely with very minor signs of wear' },
  'VG': { label: 'Very Good', description: 'Looks very good but has minor blemishes or light color fading' },
  'G': { label: 'Good', description: 'Looks used with defects' },
  'F': { label: 'Fair', description: 'Looks significantly used with serious defects' },
  'P': { label: 'Poor', description: 'Barely collectible, severe damage or heavy use' },
  'U': { label: 'Unknown', description: 'Component condition is unknown (e.g., sealed in box)' },
  'X': { label: 'Missing', description: 'Component is assumed or known to have existed but is missing' }
};

export const RARITY_MAP = {
  'R1': { label: 'Common', description: 'Easy to find' },
  'R2': { label: 'Less common', description: 'Somewhat difficult to find' },
  'R3': { label: 'Scarce', description: 'Difficult to find' },
  'R4': { label: 'Rare', description: 'Very difficult to find' },
  'R5': { label: 'Very rare', description: 'Almost impossible to find' },
  'R6': { label: 'Unique', description: 'Unique, or nearly so' }
};

// Dropbox base URL - to be configured
// This should be set as an environment variable or in a config file
export const DROPBOX_BASE_URL = process.env.REACT_APP_DROPBOX_BASE_URL || '';
