<?php

$c = $_GET['country'];
$cad = 'py getEvents.py' . " " . $c;
system($cad);

?>