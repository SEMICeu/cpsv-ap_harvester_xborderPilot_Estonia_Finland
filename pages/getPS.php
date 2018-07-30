<?php

header('Access-Control-Allow-Origin: *');
$c = $_GET['country'];
$cad = 'python getPS.py' . " " . $c;
system($cad);

?>