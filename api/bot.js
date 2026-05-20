const https = require('https');
const T_TOKEN = process.env.TELEGRAM_TOKEN;

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

  if (text === '/ترند') {
    send(chatId, "🔍 جاري تحليل خوارزمية تيك توك للبحث عن الترند الحالي في مجالك...");
    // هنا نضيف رابطاً لمصدر بيانات الترند أو التفاعل المباشر
    setTimeout(() => {
        send(chatId, "📈 إليك الفيديوهات الأكثر تفاعلاً حالياً:\n1. [رابط فيديو ترند 1]\n2. [رابط فيديو ترند 2]\nنصيحة: ابدأ بتقليد أسلوبهم الآن!");
    }, 2000);
  } else if (text === '/start') {
    send(chatId, "نظام الإدارة الذكي جاهز.\nالأوامر:\n/انعاش - تنشيط الحساب\n/ترند - كشف فيديوهات الترند\n/رد [النص] - رد آلي");
  } else {
    send(chatId, "أنا في الخدمة. استخدم /ترند لاكتشاف فرصك القادمة.");
  }
  res.status(200).send('OK');
};
