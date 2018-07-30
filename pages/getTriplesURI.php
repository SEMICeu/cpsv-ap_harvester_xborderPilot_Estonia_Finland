<?php

header('Access-Control-Allow-Origin: *');
$u = $_GET['URI'];
$c = $_GET['class'];
$cad = 'python getTriplesURI.py' . " " . $u . " " . $c;
system($cad);

?>