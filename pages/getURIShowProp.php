<?php

header('Access-Control-Allow-Origin: *');
$u = $_GET['uri'];
$cad = 'python getURIShowProp.py' . " " . $u;
system($cad);

?>