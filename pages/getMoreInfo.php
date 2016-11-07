<?php

$u = $_GET['uri'];
$cad = 'py getMoreInfo.py' . " " . $u;
system($cad);

?>