// Request collapsing - prevent multiple simultaneous GitHub calls
let fetchPromise = null;

export default async function handler(req, res) {
  // Add CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Serverless function called');

    // If already fetching, wait for existing request
    if (fetchPromise) {
      console.log('Request collapsed - using existing fetch');
      const data = await fetchPromise;
      res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
      return res.status(200).json(data);
    }

    // Start new fetch and store promise
    fetchPromise = fetchGitHubData();
    const data = await fetchPromise;
    fetchPromise = null; // Clear after completion

    // ⭐ ELITE CACHING (stale allowed for 1 day while refreshing)
    res.setHeader(
      "Cache-Control", 
      "public, s-maxage=600, stale-while-revalidate=86400"
    );

    console.log(`Returning data for ${data.length} users`);
    res.status(200).json(data);
  } catch (err) {
    fetchPromise = null; // Clear on error
    console.error('Serverless function error:', err);
    res.status(500).json({ error: "Failed to fetch GitHub data", details: err.message });
  }
}

async function fetchGitHubData() {
    const usernames = [
      "Swanjith",
      "Yogeshwara7", 
      "AKill-17",
      "KarthikeyaJ",
      "Sumanth-l",
      "C0deNe0",
      "BNsrujan",
      "ShettyVinith",
      "Dhanraj-SH"
    ];

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    console.log('Fetching GitHub data for all team members');

    // Fetch users in parallel (SAFE on server)
    const users = await Promise.all(
      usernames.map(async (username) => {
        try {
          const [userRes, repoRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, { headers }),
            fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=pushed`, { headers })
          ]);

          if (!userRes.ok) return null;

          const user = await userRes.json();
          const repos = repoRes.ok ? await repoRes.json() : [];

          // Calculate last push timing
          const lastPush = repos[0]?.pushed_at;
          let lastSeen = 'unknown';
          let status = 'away';

          if (lastPush) {
            const now = new Date();
            const pushDate = new Date(lastPush);
            const diffHours = Math.floor((now - pushDate) / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);

            if (diffHours < 1) {
              lastSeen = 'active now';
              status = 'online';
            } else if (diffHours < 6) {
              lastSeen = `active ${diffHours} hours ago`;
              status = 'coding';
            } else if (diffHours < 24) {
              lastSeen = `last seen ${diffHours} hours ago`;
              status = 'away';
            } else if (diffDays < 7) {
              lastSeen = `last seen ${diffDays} days ago`;
              status = 'away';
            } else if (diffDays < 30) {
              lastSeen = `last seen ${Math.floor(diffDays / 7)} weeks ago`;
              status = 'away';
            } else {
              lastSeen = 'inactive for a while';
              status = 'away';
            }
          }

          return {
            username,
            name: user.name || user.login,
            followers: user.followers,
            publicRepos: user.public_repos,
            bio: user.bio,
            lastSeen,
            status,
            currentProject: repos[0]?.name ?? "unknown"
          };
        } catch (error) {
          console.error(`Error fetching data for ${username}:`, error);
          return null;
        }
      })
    );

    // Remove failed users safely
    const cleanUsers = users.filter(Boolean);
    console.log(`Successfully fetched data for ${cleanUsers.length} users`);
    
    return cleanUsers;
}