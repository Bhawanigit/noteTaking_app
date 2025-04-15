<?php
require_once 'functions.php';
header('Content-Type: application/json');

$result = getCategories();
echo json_encode($result);
?>