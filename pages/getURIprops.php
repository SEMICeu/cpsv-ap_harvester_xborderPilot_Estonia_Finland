<?php

header('Access-Control-Allow-Origin: *');
$u = $_GET['uri'];
$cad = 'python getURIprops.py' . " " . $u;
system($cad);

?>