<?php
require_once __DIR__ . '/../vendor/autoload.php';
$client_key = 'awnp8zrsr8je0ukh';
$client_secret = 'JbVAZZR93MwCD0UORmKw9YOCAmGNZrgQ';
$redirect_uri = 'https://my-tiktok-auth.vercel.app/';
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWR Crow - TikTok Auth</title>
    <style>
        body { background-color: #121212; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e1e1e; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #333; }
        .btn { background: #ff0050; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; margin-top: 20px; }
        .footer-links { margin-top: 20px; font-size: 12px; }
        .footer-links a { color: #888; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>AWR Crow 🚀</h1>
        <p>بوابة المصادقة الذكية</p>
        <a href="https://www.tiktok.com/v2/auth/authorize/?<?php echo http_build_query(['client_key'=>$client_key,'scope'=>'user.info.basic','response_type'=>'code','redirect_uri'=>$redirect_uri,'state'=>'awr'.time()]); ?>" class="btn">Login with TikTok</a>
        <div class="footer-links">
            <a href="/privacy">سياسة الخصوصية</a>
            <a href="/terms">شروط الخدمة</a>
        </div>
    </div>
</body>
</html>
