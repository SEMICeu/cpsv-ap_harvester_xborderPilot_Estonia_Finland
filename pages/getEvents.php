<?php

header('Access-Control-Allow-Origin: *');
$c = $_GET['country'];
$cad = 'python getEvents.py' . " " . $c;
system($cad);

?>