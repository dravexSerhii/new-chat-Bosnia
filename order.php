<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$name    = trim(strip_tags($_POST['name'] ?? ''));
$phone   = preg_replace('/[^\d+]/', '', $_POST['phone'] ?? '');
$product = trim(strip_tags($_POST['product'] ?? ''));

if ($name === '' || strlen(preg_replace('/\D/', '', $phone)) < 11) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

// Сохраняем заявку локально; сюда же можно добавить отправку в CRM/партнёрку
$line = [date('Y-m-d H:i:s'), $name, $phone, $product, $_SERVER['REMOTE_ADDR'] ?? ''];
$fh = fopen(__DIR__ . '/orders.csv', 'a');
if ($fh) {
    flock($fh, LOCK_EX);
    fputcsv($fh, $line);
    flock($fh, LOCK_UN);
    fclose($fh);
}

echo json_encode(['ok' => true]);
