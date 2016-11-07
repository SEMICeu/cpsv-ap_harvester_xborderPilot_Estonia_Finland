<?php

$p = $_GET['p'];
$cad = 'py getProperties.py' . " " . $p;
system($cad);

?>