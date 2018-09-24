<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/server_info.php';
foreach (glob(__DIR__ . '/src/*.php') as $filename) require_once $filename;
LAMP::start();
