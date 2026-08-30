const ESPN_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

async function espnFetch(path) {
  const url = ESPN_BASE + path;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
      "Accept-Language": "it-IT,it;q=0.9,en;q=0.8"
    }
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `ESPN HTTP ${response.status}: ${text.substring(0, 300)}`
    );
  }

  return await response.json();
}

module.exports = {
  espnFetch
};
