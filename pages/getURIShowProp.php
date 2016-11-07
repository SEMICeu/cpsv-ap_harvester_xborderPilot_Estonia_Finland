<?php

$u = $_GET['uri'];
$cad = 'py getURIShowProp.py' . " " . $u;
system($cad);

?>