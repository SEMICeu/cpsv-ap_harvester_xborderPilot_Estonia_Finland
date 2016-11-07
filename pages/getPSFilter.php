<?php

$e = $_GET['ev'];
$s = $_GET['sector'];
/* $l = $_GET['lang']; */
$cad = 'py getPSFilter.py' . " " . $e . " " . $s /* . " " . $l */;
system($cad);

?>