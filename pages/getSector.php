<?php

$c = $_GET['type'];
$cad = 'py getSector.py' . " " . $c;
system($cad);

?>