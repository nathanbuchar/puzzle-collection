import React, { useState, useMemo } from 'react';
import { usePuzzles } from '../hooks/usePuzzles';
import PuzzleCard from '../components/PuzzleCard/PuzzleCard';
import styles from './CollectionPage.module.css';

function CollectionPage() {
  const { puzzles, loading, error } = usePuzzles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    series: 'all',
    origin: 'all',
    rarity: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('accession'); // accession, year, rarity, name

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    if (!puzzles.length) return { series: [], origins: [], rarities: [], statuses: [] };

    return {
      series: [...new Set(puzzles.map(p => p.series))].sort(),
      origins: [...new Set(puzzles.map(p => p.origin))].sort(),
      rarities: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
      statuses: ['A', 'L', 'M', 'X', 'XE', 'XD', 'XS']
    };
  }, [puzzles]);

  // Filter and search
  const filteredPuzzles = useMemo(() => {
    let filtered = puzzles;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.item.toLowerCase().includes(query) ||
        p.accessionNo.toLowerCase().includes(query) ||
        p.series.toLowerCase().includes(query) ||
        p.manufacturer.toLowerCase().includes(query) ||
        (p.notes && p.notes.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.series !== 'all') {
      filtered = filtered.filter(p => p.series === filters.series);
    }
    if (filters.origin !== 'all') {
      filtered = filtered.filter(p => p.origin === filters.origin);
    }
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(p => p.rarity === filters.rarity);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return a.year.localeCompare(b.year);
        case 'rarity':
          const rarityA = parseInt(a.rarity.replace('R', ''));
          const rarityB = parseInt(b.rarity.replace('R', ''));
          return rarityB - rarityA; // Higher rarity first
        case 'name':
          return a.item.localeCompare(b.item);
        case 'accession':
        default:
          return a.accessionNo.localeCompare(b.accessionNo);
      }
    });

    return sorted;
  }, [puzzles, searchQuery, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      series: 'all',
      origin: 'all',
      rarity: 'all',
      status: 'all'
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length + (searchQuery ? 1 : 0);

  if (loading) {
    return <div className={styles.loading}>Loading collection...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading collection: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Complete Collection</h1>
        <p className={styles.subtitle}>
          {filteredPuzzles.length} {filteredPuzzles.length === 1 ? 'puzzle' : 'puzzles'}
          {activeFilterCount > 0 && ` (filtered from ${puzzles.length})`}
        </p>
      </header>

      {/* Search and Filters */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search puzzles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <select
            value={filters.series}
            onChange={(e) => handleFilterChange('series', e.target.value)}
            className={styles.select}
          >
            <option value="all">All Series</option>
            {filterOptions.series.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>

          <select
            value={filters.origin}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
            className={styles.select}
          >
            <option value="all">All Origins</option>
            {filterOptions.origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>

          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
            className={styles.select}
          >
            <option value="all">All Rarities</option>
            {filterOptions.rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={styles.select}
          >
            <option value="all">All Statuses</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Sort and Clear */}
        <div className={styles.actions}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="accession">Sort by Accession</option>
            <option value="year">Sort by Year</option>
            <option value="rarity">Sort by Rarity</option>
            <option value="name">Sort by Name</option>
          </select>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className={styles.clearButton}>
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredPuzzles.length > 0 ? (
        <div className={styles.grid}>
          {filteredPuzzles.map((puzzle) => (
            <PuzzleCard key={puzzle.accessionNo} puzzle={puzzle} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No puzzles match your filters.</p>
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default CollectionPage;
