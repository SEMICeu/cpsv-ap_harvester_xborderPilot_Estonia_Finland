<?php

header('Access-Control-Allow-Origin: *');
$e = $_GET['ev'];
$cad = 'python getListPS.py' . " " . $e;
system($cad);

?>