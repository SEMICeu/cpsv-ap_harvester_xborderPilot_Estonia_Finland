<?php

header('Access-Control-Allow-Origin: *');
$c = $_GET['type'];
$cad = 'python getLanguage.py' . " " . $c;
system($cad);

?>