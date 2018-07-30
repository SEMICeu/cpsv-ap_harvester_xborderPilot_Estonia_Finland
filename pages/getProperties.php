<?php

header('Access-Control-Allow-Origin: *');
$p = $_GET['p'];
$cad = 'python getProperties.py' . " " . $p;
system($cad);

?>