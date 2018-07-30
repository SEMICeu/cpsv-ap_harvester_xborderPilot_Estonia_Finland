<?php

header('Access-Control-Allow-Origin: *');
$e = $_GET['ev'];
$s = $_GET['sector'];
$cad = 'python getPSFilter.py' . " " . $e . " " . $s;
system($cad);

?>