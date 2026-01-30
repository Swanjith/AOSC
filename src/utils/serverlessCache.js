// Simplified cache for serverless data
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (shorter since server handles main caching)

class ServerlessCache {
  constructor() {
    this.cache = new Map();
  }

  getCachedData(key) {
    if (this.cache.has(key)) {
      const { data, timestamp } = this.cache.get(key);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log(`Using memory cache for ${key}`);
        return data;
      }
      this.cache.delete(key);
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async fetchTeamGitHubData() {
    const cacheKey = 'team-github-data';

    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      console.log('Fetching team data from serverless function');
      const response = await fetch('/api/team-github');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      this.setCachedData(cacheKey, data);
      console.log('Cached serverless response');

      return data;
    } catch (error) {
      console.error('Error fetching from serverless:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

// Create global instance
export const serverlessCache = new ServerlessCache();

// Export utility function
export const fetchTeamGitHubData = () => serverlessCache.fetchTeamGitHubData();