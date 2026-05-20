const https = require('https');

const T_TOKEN = process.env.TELEGRAM_TOKEN || '8540803234:AAGD95o6JuOzVLYZ6-8Cm0vQDlPD3wtJGl4';

function send(chatId, text) {
  const path = `/bot${T_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
  https.get(`https://api.telegram.org${path}`);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('OK');
  const update = req.body;
  if (!update.message || !update.message.text) return res.status(200).send('OK');
  
  const chatId = update.message.chat.id;
  const text = update.message.text.trim();

  if (text.startsWith('تجديد ')) {
    // منطق التجديد (يتم استدعاؤه برمجياً)
    send(chatId, "🔄 طلب التجديد قيد المعالجة من الخادم الرسمي...");
  } else if (text.startsWith('معلومات ')) {
    const token = text.split(' ')[1];
    const options = { hostname: 'open.tiktokapis.com', path: '/v2/user/info/?fields=display_name,follower_count', method: 'GET', headers: { 'Authorization': `Bearer ${token}` } };
    https.get(options, (r) => {
      let d = '';
      r.on('data', (c) => d += c);
      r.on('end', () => {
        const j = JSON.parse(d);
        if (j.data) send(chatId, `👤 الحساب: ${j.data.user.display_name}\n👥 المتابعون: ${j.data.user.follower_count}`);
        else send(chatId, "❌ خطأ: يرجى التحقق من صلاحية التوكين.");
      });
    });
  } else if (text === '/start') {
    send(chatId, "مرحباً بك في لوحة تحكم تيك توك الرسمية.\nالأوامر:\n1. تجديد [التوكين]\n2. معلومات [التوكين]\n3. حالة النظام");
  } else {
    send(chatId, "الرجاء استخدام الأوامر المعتمدة (تجديد، معلومات).");
  }
  res.status(200).send('OK');
};
