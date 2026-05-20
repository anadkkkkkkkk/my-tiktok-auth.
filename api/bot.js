const https = require('https');

const TELEGRAM_TOKEN = '8540803234:AAGD95o6JuOzVLYZ6-8Cm0vQDlPD3wtJGl4';
const CLIENT_KEY = 'sbawsudq1bxhkm3b3y';
const CLIENT_SECRET = 'hddQpiSl5FTstFFjEYxifCWvNdvifUXa';

function sendTelegram(chatId, text) {
  const path = `/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
  https.get(`https://api.telegram.org${path}`);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('OK');
  
  const update = req.body;
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    if (text.startsWith('تجديد ')) {
      const refreshToken = text.split(' ')[1];
      sendTelegram(chatId, "🔄 جاري الاتصال بتيك توك لتجديد التوكين...");
      
      const postData = `client_key=${CLIENT_KEY}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;
      const options = {
        hostname: 'open.tiktokapis.com',
        path: '/v2/oauth/token/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };

      const reqT = https.request(options, (resp) => {
        let data = '';
        resp.on('data', (c) => data += c);
        resp.on('end', () => {
          const resJson = JSON.parse(data);
          if (resJson.access_token) {
            sendTelegram(chatId, `✅ تم التجديد بنجاح!\n\n🔑 التوكين الجديد:\n${resJson.access_token}\n\n🔄 التوكين المجدد التالي:\n${resJson.refresh_token}`);
          } else {
            sendTelegram(chatId, `❌ فشل التجديد: ${resJson.error_description || 'توكين غير صالح'}`);
          }
        });
      });
      reqT.write(postData);
      reqT.end();
      
    } else if (text === '/status') {
      sendTelegram(chatId, "✅ المحرك جاهز وبانتظار أوامرك.");
    } else {
      sendTelegram(chatId, "مرحباً! استخدم الأمر التالي لتجديد التوكين:\nتجديد [ضع_التوكين_هنا]");
    }
  }
  res.status(200).send('OK');
};
