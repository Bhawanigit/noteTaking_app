<?php
require_once 'functions.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? '';
    $content = $data['content'] ?? '';
    $category = $data['category'] ?? '';
    $color = $data['color'] ?? '';

    if (!empty($title) && !empty($content) && !empty($category)) {
        $result = addNote($title, $content, $category, $color);
        echo json_encode($result);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>