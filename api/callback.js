module.exports = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. التوثيق التلقائي مع تيك توك
  if (url.searchParams.has('tiktok-developers-site-verification')) {
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Tiktok-developers-site-verification=X0rbCBz0sv0XGnslTmw9ZyRWVDIdmha5');
  }

  // 2. محرك استخراج البيانات (API Extractor)
  // هذا المسار يستقبل البيانات ويخزنها داخلياً
  if (url.pathname === '/api/auth') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // هنا يتم استخراج البيانات والاحتفاظ بها
    console.log("--- AWR DATA EXTRACTED ---");
    console.log("CODE:", code);
    console.log("STATE:", state);
    console.log("--------------------------");

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: "extracted",
      message: "Data processed by AWR Engine"
    }));
  }

  res.end('AWR Engine: System Active.');
};
