<?php

$e = $_GET['ev'];
$cad = 'py getListPS.py' . " " . $e;
system($cad);

?>