const { Bot } = require("grammy");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const bot = new Bot(process.env.TELEGRAM_TOKEN);

// إضافة هذا السطر لنرى إذا كان البوت يستلم الرسائل فعلاً
bot.on("message", (ctx) => {
  console.log("📥 رسالة جديدة وصلت من: " + ctx.from.first_name);
});

bot.on(["message:audio", "message:voice"], async (ctx) => {
  console.log("🎵 جاري معالجة صوت...");
  ctx.reply("⚙️ جاري المعالجة...");
  
  const file = await ctx.getFile();
  const inputPath = `./input.mp3`;
  const outputPath = `./output.mp3`;
  
  await file.download(inputPath);

  ffmpeg(inputPath)
    .audioFilters(['aecho=0.8:0.9:500:0.4'])
    .save(outputPath)
    .on('end', async () => {
      await ctx.replyWithAudio(outputPath);
      console.log("✅ تم الإرسال بنجاح");
    })
    .on('error', (err) => {
      console.error("❌ خطأ:", err);
      ctx.reply("خطأ: " + err.message);
    });
});

bot.start();
console.log("البوت الآن يستمع...");
