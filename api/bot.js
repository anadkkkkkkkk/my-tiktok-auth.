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

  // نظام الرد التلقائي وتوثيق العمليات
  if (text.startsWith('تجديد ')) {
    send(chatId, "✅ تم استلام الطلب وتوثيقه. جاري التواصل مع الخوادم الرسمية...");
    // هنا تضع منطق الربط الفعلي مع API تيك توك
  } else if (text.startsWith('معلومات ')) {
    send(chatId, "🔍 جاري جلب وتوثيق بيانات الحساب من تيك توك...");
  } else if (text === '/start') {
    send(chatId, "مرحباً بك في نظام الإدارة الرسمي. النظام جاهز للتوثيق والرد التلقائي.\nالأوامر: تجديد، معلومات، حالة.");
  } else {
    send(chatId, "النظام يعمل: بانتظار أوامرك (تجديد/معلومات).");
  }
  res.status(200).send('OK');
};
