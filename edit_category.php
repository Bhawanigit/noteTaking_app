<?php
header('Content-Type: application/json');
require_once 'functions.php';

$data = json_decode(file_get_contents('php://input'), true);
$oldCategory = $data['oldCategory'];
$newCategory = $data['newCategory'];

if (!$oldCategory || !$newCategory) {
    echo json_encode(['success' => false, 'message' => 'Invalid category data.']);
    exit();
}

$result = editCategory($oldCategory, $newCategory);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update category.']);
}
?>
