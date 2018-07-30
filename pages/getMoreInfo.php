<?php

header('Access-Control-Allow-Origin: *');
$u = $_GET['uri'];
$cad = 'python getMoreInfo.py' . " " . $u;
system($cad);

?>