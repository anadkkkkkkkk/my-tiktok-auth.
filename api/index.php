<?php
$code = 'Tiktok-developers-site-verification=X0rbCBz0sv0XGnslTmw9ZyRWVDIdmha5';
if (strpos($_SERVER['REQUEST_URI'], 'tiktok-developers-site-verification') !== false) {
    header('Content-Type: text/plain');
    die($code);
}
?>
<!DOCTYPE html>
<html>
<body style="background:#000; color:#fff; text-align:center; padding-top:20%;">
    <h1>AWR System - Online</h1>
</body>
</html>
