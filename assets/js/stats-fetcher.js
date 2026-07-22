const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class StatsFetcher {
  static async fetchStats(endpoint) {
    const cacheKey = `stats_${endpoint}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    try {
      // Small artificial delay to show loading state nicely
      await new Promise(resolve => setTimeout(resolve, 600));
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }
}
