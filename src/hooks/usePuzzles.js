import { useState, useEffect } from 'react';

/**
 * Custom hook to load and manage puzzle collection data
 * Fetches data from public/data/puzzles.json (metadata from spreadsheet)
 * and public/data/puzzle-images.json (photos from Google Drive)
 * and merges them together
 */
export function usePuzzles() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPuzzles() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both puzzle metadata and images in parallel
        const [puzzlesResponse, imagesResponse] = await Promise.all([
          fetch('/data/puzzles.json'),
          fetch('/data/puzzle-images.json').catch(() => null) // Don't fail if images file doesn't exist yet
        ]);

        if (!puzzlesResponse.ok) {
          throw new Error(`Failed to load puzzle data: ${puzzlesResponse.statusText}`);
        }

        const puzzlesData = await puzzlesResponse.json();

        // Load images data if available
        let imagesData = {};
        if (imagesResponse && imagesResponse.ok) {
          imagesData = await imagesResponse.json();
        }

        // Merge images data into puzzles
        const mergedPuzzles = puzzlesData.map(puzzle => ({
          ...puzzle,
          ...(imagesData[puzzle.accessionNo] || {})
        }));

        setPuzzles(mergedPuzzles);
      } catch (err) {
        console.error('Error loading puzzles:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadPuzzles();
  }, []);

  return {
    puzzles,
    loading,
    error
  };
}
