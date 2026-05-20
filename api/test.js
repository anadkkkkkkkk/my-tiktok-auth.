const https = require('https');

const TELEGRAM_TOKEN = '8764995786:AAH6TdLNgNP7n13JKr7M8GSFlgW3Sr87dXE';
const TELEGRAM_CHAT_ID = '7644255708';

module.exports = async (req, res) => {
  const path = `/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent("🚨 فحص الاتصال: السيرفر يحاول التحدث مع البوت الآن!")}`;
  
  https.get(`https://api.telegram.org${path}`, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    apiRes.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data); // هنا سيطبع لنا سيرفر تليجرام سبب المشكلة بدقة
    });
  }).on('error', (e) => {
    res.end(`🔴 خطأ في الاتصال بسيرفر تليجرام: ${e.message}`);
  });
};
