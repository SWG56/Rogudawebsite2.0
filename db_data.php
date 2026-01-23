<?php
declare(strict_types=1);

$host = "localhost";
$db   = "rogudat3b7y0_admissions";
$user = "rogudat3b7y0_nyiko";
$pass = "VAGDQdsxC]QrmFo3";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, $user, $pass, $options);
