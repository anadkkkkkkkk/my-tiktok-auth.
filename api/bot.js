const { Bot } = require("grammy");
const { execSync } = require("child_process");
const bot = new Bot(process.env.TELEGRAM_TOKEN);

// معالجة الفيديو: دمج الصوت المضاف له صدى مع الفيديو الأصلي
bot.on("message:video", async (ctx) => {
  ctx.reply("🎬 جاري المونتاج وإضافة الصدى... لحظات.");
  const file = await ctx.getFile();
  await file.download("./input.mp4");

  // معالجة الصوت: استخراج الصوت، إضافة صدى (Echo)، ودمجه مع الفيديو
  execSync('ffmpeg -i input.mp4 -af "aecho=0.8:0.9:500:0.4" output.mp4');
  
  await ctx.replyWithVideo("./output.mp4", { caption: "✅ تم المونتاج وإضافة الصدى بنجاح! جاهز للنشر." });
});

module.exports = async (req, res) => {
  await bot.handleUpdate(req.body, res);
};
