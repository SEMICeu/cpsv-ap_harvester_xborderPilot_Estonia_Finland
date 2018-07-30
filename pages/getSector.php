<?php

header('Access-Control-Allow-Origin: *');
$c = $_GET['type'];
$cad = 'python getSector.py' . " " . $c;
system($cad);

?>