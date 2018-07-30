<?php

header('Access-Control-Allow-Origin: *');
$c = $_GET['country'];
$e = $_GET['ev'];
$cad = 'python getPSEvent.py' . " " . $c . " " . $e;
system($cad);

?>