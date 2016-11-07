<?php

$u = $_GET['uri'];
$cad = 'py getURIprops.py' . " " . $u;
system($cad);

?>