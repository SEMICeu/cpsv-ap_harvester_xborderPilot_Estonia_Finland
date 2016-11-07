<?php

$c = $_GET['country'];
$e = $_GET['ev'];
$cad = 'py getPSEvent.py' . " " . $c . " " . $e;
system($cad);

?>