<?php

$c = $_GET['country'];
$cad = 'py getPS.py' . " " . $c;
system($cad);

?>