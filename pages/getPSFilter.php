<?php

header('Access-Control-Allow-Origin: *');
$e = $_GET['ev'];
$s = $_GET['sector'];
/* $l = $_GET['lang']; */
$cad = 'python getPSFilter.py' . " " . $e . " " . $s /* . " " . $l */;
system($cad);

?>