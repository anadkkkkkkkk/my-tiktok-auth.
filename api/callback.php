<?php
// صفحة استقبال البيانات من تيك توك
$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';

echo "<!DOCTYPE html>
<html lang='ar'>
<head>
    <meta charset='UTF-8'>
    <title>تم تسجيل الدخول بنجاح</title>
    <style>
        body { background-color: #121212; color: white; text-align: center; font-family: sans-serif; padding-top: 50px; }
        .success-card { background: #1e1e1e; padding: 30px; border-radius: 15px; display: inline-block; border: 2px solid #fe2c55; }
        .user-code { color: #fe2c55; font-weight: bold; }
    </style>
</head>
<body>
    <div class='success-card'>
        <h1>✅ تمت المصادقة بنجاح!</h1>
        <p>مرحباً بك في AWR Crow</p>
        <p>كود الجلسة الخاص بك: <span class='user-code'>$code</span></p>
        <hr>
        <p>سيتم الآن عرض ملفك الشخصي قريباً...</p>
        <a href='/' style='color: white; text-decoration: none; background: #333; padding: 10px 20px; border-radius: 5px;'>العودة للرئيسية</a>
    </div>
</body>
</html>";
