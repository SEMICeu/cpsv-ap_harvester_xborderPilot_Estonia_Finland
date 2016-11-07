<?php

$c = $_GET['type'];
$cad = 'py getLanguage.py' . " " . $c;
system($cad);

?>