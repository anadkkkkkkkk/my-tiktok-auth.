<?php
require_once __DIR__ . '/vendor/autoload.php';

// بيانات تطبيقك AWR من TikTok Developers
$clientKey = 'sbawsdq1bxhkm3b3y';
$clientSecret = 'hddQpiSISFTstFFjEYxlfCWvNdvlfUXa';
$redirectUri = 'https://my-tiktok-auth.vercel.app/'; 

$api = new \JanStolpe\TikTokApi\TikTokApi($clientKey, $clientSecret, $redirectUri);

// إذا رجع الكود من تيك توك بعد موافقة المستخدم
if (isset($_GET['code'])) {
    try {
        $token = $api->getAccessToken($_GET['code']);
        echo "<h1>تم تسجيل الدخول بنجاح لـ AWR!</h1>";
        echo "<h3>بيانات الـ Access Token:</h3>";
        echo "<pre style='background:#f4f4f4; padding:10px;'>";
        print_r($token); 
        echo "</pre>";
    } catch (Exception $e) {
        echo "خطأ في جلب التوكن: " . $e->getMessage();
    }
} else {
    // رابط تسجيل الدخول مع الصلاحيات المطلوبة
    $url = $api->getAuthorizeUrl(['user.info.basic', 'video.list', 'video.upload']);
    echo "<div style='text-align:center; margin-top:50px;'>";
    echo "<h2>مرحباً بك في نظام AWR Sandbox</h2>";
    echo "<a href='$url' style='padding:15px 30px; background:#000; color:#fff; text-decoration:none; border-radius:5px; font-family:Arial;'>تسجيل الدخول عبر TikTok</a>";
    echo "</div>";
}

