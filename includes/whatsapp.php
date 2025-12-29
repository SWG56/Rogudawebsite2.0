<?php
// =====================================================
// Roguda - WhatsApp Helper (Optional)
// Uses WhatsApp Cloud API (Meta) to send a simple text.
// REQUIREMENTS:
// - WhatsApp Business account + Cloud API set up
// - Permanent access token (or regularly refreshed token)
// - Phone Number ID from Meta
// - Recipient must be able to receive messages (opt-in) and
//   in many cases you must use approved templates for proactive messages.
//
// If config is missing, functions will fail silently (return false).
// =====================================================

function roguda_whatsapp_config() {
  // Option A: Load local config file (recommended on shared hosting)
  $configFile = __DIR__ . '/whatsapp-config.php';
  if (file_exists($configFile)) {
    // whatsapp-config.php should define:
    // $WHATSAPP_TOKEN, $WHATSAPP_PHONE_NUMBER_ID, $WHATSAPP_TO_NUMBER
    include $configFile;

    return [
      'token' => isset($WHATSAPP_TOKEN) ? $WHATSAPP_TOKEN : '',
      'phone_number_id' => isset($WHATSAPP_PHONE_NUMBER_ID) ? $WHATSAPP_PHONE_NUMBER_ID : '',
      'to' => isset($WHATSAPP_TO_NUMBER) ? $WHATSAPP_TO_NUMBER : '',
    ];
  }

  // Option B: Environment variables (if your hosting supports it)
  return [
    'token' => getenv('WHATSAPP_TOKEN') ?: '',
    'phone_number_id' => getenv('WHATSAPP_PHONE_NUMBER_ID') ?: '',
    'to' => getenv('WHATSAPP_TO_NUMBER') ?: '',
  ];
}

function roguda_send_whatsapp_text($message) {
  $cfg = roguda_whatsapp_config();
  if (!$cfg['token'] || !$cfg['phone_number_id'] || !$cfg['to']) {
    return false;
  }

  $url = "https://graph.facebook.com/v20.0/" . $cfg['phone_number_id'] . "/messages";

  $payload = [
    'messaging_product' => 'whatsapp',
    'to' => $cfg['to'],
    'type' => 'text',
    'text' => ['body' => $message],
  ];

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $cfg['token'],
    "Content-Type: application/json"
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  curl_setopt($ch, CURLOPT_TIMEOUT, 10);

  $resp = curl_exec($ch);
  $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  // Success codes are typically 200
  return ($http >= 200 && $http < 300);
}
?>
