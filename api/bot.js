const { Bot, webhookCallback } = require("grammy");

const bot = new Bot(process.env.TELEGRAM_TOKEN);

// الترحيب
bot.command("start", (ctx) => {
    ctx.reply("👑 AWR TikTok Engine جاهز للعمل.\nأرسل بيانات الحساب وسأقوم باستخراج التوكنات فوراً.");
});

// منطق الصيد (بدون أي إضافات خارجية)
bot.on("message:text", (ctx) => {
    const text = ctx.message.text;
    
    // استخراج التوكنات
    const actMatch = text.match(/act\.[a-zA-Z0-9\._-]+/);
    const rftMatch = text.match(/rft\.[a-zA-Z0-9\._-]+/);

    if (actMatch || rftMatch) {
        let result = "🎯 **SUCCESS TIKTOK DATA** 🎯\n\n";
        if (actMatch) result += `🔑 ACCESS TOKEN:\n${actMatch[0]}\n\n`;
        if (rftMatch) result += `🔄 REFRESH TOKEN:\n${rftMatch[0]}`;
        
        ctx.reply(result);
    }
});

module.exports = webhookCallback(bot, "http");

