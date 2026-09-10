module.exports = async (req, res) => {
  const SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbwrAbet2kGMNHKqoYERq10FRFOhM3p6PP7yW6mn-dJ-3nsJpVvhWnvzBW4ZBfZrzjdp0w/exec";
  const baseUrl = "https://golden-trading-strategies.vercel.app";

  try {
    const response = await fetch(SCRIPT_API_URL);
    const data = await response.json();

    let urlsXml = `
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    if (data && data.articles && Array.isArray(data.articles)) {
      data.articles.forEach(art => {
        if (art.key) {
          urlsXml += `
  <url>
    <loc>${baseUrl}/strategy?key=${art.key}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(sitemap);

  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
};
