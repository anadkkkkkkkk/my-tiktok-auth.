module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  const url = req.url || '';

  if (url.includes('tiktok-developers-site-verification')) {
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Tiktok-developers-site-verification=X0rbCBz0sv0XGnslTmw9ZyRWVDIdmha5');
  }

  if (url.includes('/api/callback') || url.includes('/api/auth')) {
    const urlParts = url.split('?');
    const queryString = urlParts.length > 1 ? urlParts[1] : '';
    const params = new URLSearchParams(queryString);
    const code = params.get('code');

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: "success",
      message: "AWR Engine: Interface Ready",
      received_code: code || "No code provided yet"
    }));
  }

  res.setHeader('Content-Type', 'text/plain');
  res.end('AWR Central Engine Ready');
};
